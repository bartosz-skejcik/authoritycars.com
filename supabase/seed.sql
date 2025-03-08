

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."create_audit_log"("action" "text", "entity_id" "text" DEFAULT NULL::"text", "entity_type" "text" DEFAULT NULL::"text", "old_values" "jsonb" DEFAULT NULL::"jsonb", "new_values" "jsonb" DEFAULT NULL::"jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  user_id UUID := public.get_auth_user_id();
BEGIN
  INSERT INTO public.audit_logs (
    action,
    user_id,
    entity_id,
    entity_type,
    old_values,
    new_values,
    ip_address,
    user_agent
  )
  VALUES (
    action,
    user_id,
    entity_id,
    entity_type,
    old_values,
    new_values,
    NULLIF(current_setting('request.headers.x-forwarded-for', true), ''),
    NULLIF(current_setting('request.headers.user-agent', true), '')
  );
END;
$$;


ALTER FUNCTION "public"."create_audit_log"("action" "text", "entity_id" "text", "entity_type" "text", "old_values" "jsonb", "new_values" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_auth_user_id"() RETURNS "uuid"
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  SELECT NULLIF(COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub', 
    current_setting('request.headers.x-user-id', true)
  ), '')::uuid;
$$;


ALTER FUNCTION "public"."get_auth_user_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_profile_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  user_id UUID := public.get_auth_user_id();
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (action, user_id, entity_id, entity_type, new_values)
    VALUES (
      'profile_created', 
      COALESCE(user_id, NEW.id), -- If no user_id, use profile id itself (self-registration)
      NEW.id::text,
      'profile',
      jsonb_build_object(
        'username', NEW.username,
        'full_name', NEW.full_name
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Only log if there are actual changes
    IF NEW.username IS DISTINCT FROM OLD.username OR 
       NEW.full_name IS DISTINCT FROM OLD.full_name OR 
       NEW.website IS DISTINCT FROM OLD.website OR 
       NEW.avatar_url IS DISTINCT FROM OLD.avatar_url THEN
      INSERT INTO public.audit_logs (
        action, user_id, entity_id, entity_type, old_values, new_values
      )
      VALUES (
        'profile_updated', 
        COALESCE(user_id, NEW.id), -- If no user_id, assume self-update
        NEW.id::text,
        'profile',
        jsonb_build_object(
          'username', OLD.username,
          'full_name', OLD.full_name,
          'website', OLD.website,
          'avatar_url', OLD.avatar_url
        ),
        jsonb_build_object(
          'username', NEW.username,
          'full_name', NEW.full_name,
          'website', NEW.website,
          'avatar_url', NEW.avatar_url
        )
      );
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (action, user_id, entity_id, entity_type, old_values)
    VALUES (
      'profile_deleted', 
      COALESCE(user_id, OLD.id),
      OLD.id::text,
      'profile',
      jsonb_build_object(
        'username', OLD.username,
        'full_name', OLD.full_name
      )
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."log_profile_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_profile_changes_with_context"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (
      action, user_id, entity_id, entity_type, new_values
    )
    VALUES (
      'profile_created', 
      NEW.id, 
      NEW.id::text, 
      'profile',
      jsonb_build_object(
        'username', NEW.username,
        'full_name', NEW.full_name,
        'website', NEW.website,
        'avatar_url', NEW.avatar_url
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Only log if there are actual changes
    IF NEW.username != OLD.username OR 
       NEW.full_name != OLD.full_name OR 
       NEW.website != OLD.website OR 
       NEW.avatar_url != OLD.avatar_url THEN
      INSERT INTO public.audit_logs (
        action, user_id, entity_id, entity_type, old_values, new_values
      )
      VALUES (
        'profile_updated', 
        NEW.id, 
        NEW.id::text, 
        'profile',
        jsonb_build_object(
          'username', OLD.username,
          'full_name', OLD.full_name,
          'website', OLD.website,
          'avatar_url', OLD.avatar_url
        ),
        jsonb_build_object(
          'username', NEW.username,
          'full_name', NEW.full_name,
          'website', NEW.website,
          'avatar_url', NEW.avatar_url
        )
      );
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (
      action, user_id, entity_id, entity_type, old_values
    )
    VALUES (
      'profile_deleted', 
      OLD.id, 
      OLD.id::text, 
      'profile',
      jsonb_build_object(
        'username', OLD.username,
        'full_name', OLD.full_name,
        'website', OLD.website,
        'avatar_url', OLD.avatar_url
      )
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."log_profile_changes_with_context"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_public_submission"("submission_id" bigint, "name" "text", "phone" "text", "vehicle_type" "text", "budget_from" real, "budget_to" real, "ref" "text" DEFAULT NULL::"text", "ip_address" "text" DEFAULT NULL::"text", "user_agent" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.audit_logs (
    action,
    entity_id,
    entity_type,
    new_values,
    ip_address,
    user_agent,
    submitter_name
  )
  VALUES (
    'public_submission_created',
    submission_id::TEXT,
    'submission',
    jsonb_build_object(
      'name', name,
      'phone', phone,
      'vehicle_type', vehicle_type,
      'budget_range', format('%s-%s', budget_from, budget_to),
      'ref', ref
    ),
    ip_address,
    user_agent,
    name  -- Store the submitter's name directly
  );
END;
$$;


ALTER FUNCTION "public"."log_public_submission"("submission_id" bigint, "name" "text", "phone" "text", "vehicle_type" "text", "budget_from" real, "budget_to" real, "ref" "text", "ip_address" "text", "user_agent" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_status_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  user_id UUID := public.get_auth_user_id();
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (
      action, 
      user_id, 
      entity_id, 
      entity_type,
      new_values
    )
    VALUES (
      'status_created', 
      user_id,
      NEW.id::text,
      'status',
      jsonb_build_object('name', NEW.name)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (
      action, 
      user_id, 
      entity_id, 
      entity_type,
      old_values,
      new_values
    )
    VALUES (
      'status_updated', 
      user_id,
      NEW.id::text,
      'status',
      jsonb_build_object('name', OLD.name),
      jsonb_build_object('name', NEW.name)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (
      action, 
      user_id, 
      entity_id, 
      entity_type,
      old_values
    )
    VALUES (
      'status_deleted', 
      user_id,
      OLD.id::text,
      'status',
      jsonb_build_object('name', OLD.name)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."log_status_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_submission_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  user_id UUID := public.get_auth_user_id();
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (
      action, 
      user_id, 
      entity_id, 
      entity_type,
      new_values,
      ip_address,
      user_agent,
      submitter_name
    )
    VALUES (
      'submission_created', 
      user_id, -- Can be NULL for unauthenticated submissions
      NEW.id::text,
      'submission',
      jsonb_build_object(
        'name', NEW.name,
        'phone', NEW.phone,
        'vehicle_type', NEW.vehicle_type,
        'budget_range', format('%s-%s', NEW.budget_from, NEW.budget_to),
        'ref', NEW.ref
      ),
      NULLIF(current_setting('request.headers.x-forwarded-for', true), ''),
      NULLIF(current_setting('request.headers.user-agent', true), ''),
      NEW.name -- Store the submitter's name
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status change
    IF NEW.status_id IS DISTINCT FROM OLD.status_id THEN
      INSERT INTO public.audit_logs (
        action, 
        user_id, 
        entity_id, 
        entity_type,
        old_values,
        new_values
      )
      VALUES (
        'submission_status_changed', 
        user_id, -- This should be an authenticated action
        NEW.id::text,
        'submission',
        jsonb_build_object('status_id', OLD.status_id),
        jsonb_build_object('status_id', NEW.status_id)
      );
    END IF;
    
    -- Handle assignment change
    IF NEW.assigned_user_id IS DISTINCT FROM OLD.assigned_user_id THEN
      INSERT INTO public.audit_logs (
        action, 
        user_id, 
        entity_id, 
        entity_type,
        old_values,
        new_values
      )
      VALUES (
        'submission_assignment_changed', 
        user_id, -- This should be an authenticated action
        NEW.id::text,
        'submission',
        jsonb_build_object('assigned_user_id', OLD.assigned_user_id),
        jsonb_build_object('assigned_user_id', NEW.assigned_user_id)
      );
    END IF;
    
    -- Handle other updates
    IF NEW.phone IS DISTINCT FROM OLD.phone OR 
       NEW.name IS DISTINCT FROM OLD.name OR 
       NEW.budget_from IS DISTINCT FROM OLD.budget_from OR 
       NEW.budget_to IS DISTINCT FROM OLD.budget_to OR 
       NEW.vehicle_type IS DISTINCT FROM OLD.vehicle_type OR
       NEW.ref IS DISTINCT FROM OLD.ref THEN
      INSERT INTO public.audit_logs (
        action, 
        user_id, 
        entity_id, 
        entity_type,
        old_values,
        new_values
      )
      VALUES (
        'submission_updated', 
        user_id, -- This should be an authenticated action
        NEW.id::text,
        'submission',
        jsonb_build_object(
          'name', OLD.name,
          'phone', OLD.phone,
          'vehicle_type', OLD.vehicle_type,
          'budget_from', OLD.budget_from,
          'budget_to', OLD.budget_to,
          'ref', OLD.ref
        ),
        jsonb_build_object(
          'name', NEW.name,
          'phone', NEW.phone,
          'vehicle_type', NEW.vehicle_type,
          'budget_from', NEW.budget_from,
          'budget_to', NEW.budget_to,
          'ref', NEW.ref
        )
      );
    END IF;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (
      action, 
      user_id, 
      entity_id, 
      entity_type,
      old_values
    )
    VALUES (
      'submission_deleted', 
      user_id, -- This should be an authenticated action
      OLD.id::text,
      'submission',
      jsonb_build_object(
        'name', OLD.name,
        'phone', OLD.phone,
        'vehicle_type', OLD.vehicle_type,
        'budget_range', format('%s-%s', OLD.budget_from, OLD.budget_to)
      )
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."log_submission_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_submission_tag_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  user_id UUID := public.get_auth_user_id();
  tag_name TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Get tag name for better logging
    SELECT name INTO tag_name FROM public.tags WHERE id = NEW.tag_id;
    
    INSERT INTO public.audit_logs (
      action, 
      user_id, 
      entity_id, 
      entity_type,
      new_values
    )
    VALUES (
      'tag_added_to_submission', 
      user_id,
      format('%s-%s', NEW.submission_id, NEW.tag_id),
      'submission_tag',
      jsonb_build_object(
        'submission_id', NEW.submission_id,
        'tag_id', NEW.tag_id,
        'tag_name', tag_name
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Get tag name for better logging
    SELECT name INTO tag_name FROM public.tags WHERE id = OLD.tag_id;
    
    INSERT INTO public.audit_logs (
      action, 
      user_id, 
      entity_id, 
      entity_type,
      old_values
    )
    VALUES (
      'tag_removed_from_submission', 
      user_id,
      format('%s-%s', OLD.submission_id, OLD.tag_id),
      'submission_tag',
      jsonb_build_object(
        'submission_id', OLD.submission_id,
        'tag_id', OLD.tag_id,
        'tag_name', tag_name
      )
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."log_submission_tag_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_tag_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  user_id UUID := public.get_auth_user_id();
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (
      action, 
      user_id, 
      entity_id, 
      entity_type,
      new_values
    )
    VALUES (
      'tag_created', 
      user_id,
      NEW.id::text,
      'tag',
      jsonb_build_object(
        'name', NEW.name,
        'hex', NEW.hex
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (
      action, 
      user_id, 
      entity_id, 
      entity_type,
      old_values,
      new_values
    )
    VALUES (
      'tag_updated', 
      user_id,
      NEW.id::text,
      'tag',
      jsonb_build_object(
        'name', OLD.name,
        'hex', OLD.hex
      ),
      jsonb_build_object(
        'name', NEW.name,
        'hex', NEW.hex
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (
      action, 
      user_id, 
      entity_id, 
      entity_type,
      old_values
    )
    VALUES (
      'tag_deleted', 
      user_id,
      OLD.id::text,
      'tag',
      jsonb_build_object(
        'name', OLD.name,
        'hex', OLD.hex
      )
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."log_tag_changes"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" bigint NOT NULL,
    "timestamp" timestamp with time zone DEFAULT "now"() NOT NULL,
    "action" character varying NOT NULL,
    "user_id" "uuid",
    "entity_id" "text",
    "entity_type" "text",
    "old_values" "jsonb",
    "new_values" "jsonb",
    "ip_address" "text",
    "user_agent" "text",
    "submitter_name" "text"
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


ALTER TABLE "public"."audit_logs" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."audit_logs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "username" "text",
    "full_name" "text",
    "avatar_url" "text",
    "website" "text",
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."submissions" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "phone" character varying NOT NULL,
    "name" character varying NOT NULL,
    "budget_from" real NOT NULL,
    "budget_to" real NOT NULL,
    "vehicle_type" character varying NOT NULL,
    "status_id" bigint,
    "assigned_user_id" "uuid",
    "ref" character varying
);


ALTER TABLE "public"."submissions" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."referrers" AS
 SELECT DISTINCT "submissions"."ref"
   FROM "public"."submissions";


ALTER TABLE "public"."referrers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."statuses" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" character varying NOT NULL
);


ALTER TABLE "public"."statuses" OWNER TO "postgres";


ALTER TABLE "public"."statuses" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."statuses_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."submission_tags" (
    "submission_id" integer NOT NULL,
    "tag_id" integer NOT NULL
);


ALTER TABLE "public"."submission_tags" OWNER TO "postgres";


ALTER TABLE "public"."submissions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."submissions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" character varying NOT NULL,
    "hex" character varying DEFAULT '#f00'::character varying NOT NULL
);


ALTER TABLE "public"."tags" OWNER TO "postgres";


ALTER TABLE "public"."tags" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."tags_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."statuses"
    ADD CONSTRAINT "statuses_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."statuses"
    ADD CONSTRAINT "statuses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."submission_tags"
    ADD CONSTRAINT "submission_tags_pkey" PRIMARY KEY ("submission_id", "tag_id");



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_phone_key" UNIQUE ("phone");



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "profile_audit_trigger" AFTER INSERT OR DELETE OR UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."log_profile_changes"();



CREATE OR REPLACE TRIGGER "status_audit_trigger" AFTER INSERT OR DELETE OR UPDATE ON "public"."statuses" FOR EACH ROW EXECUTE FUNCTION "public"."log_status_changes"();



CREATE OR REPLACE TRIGGER "submission_audit_trigger" AFTER INSERT OR DELETE OR UPDATE ON "public"."submissions" FOR EACH ROW EXECUTE FUNCTION "public"."log_submission_changes"();



CREATE OR REPLACE TRIGGER "submission_tag_audit_trigger" AFTER INSERT OR DELETE ON "public"."submission_tags" FOR EACH ROW EXECUTE FUNCTION "public"."log_submission_tag_changes"();



CREATE OR REPLACE TRIGGER "tag_audit_trigger" AFTER INSERT OR DELETE OR UPDATE ON "public"."tags" FOR EACH ROW EXECUTE FUNCTION "public"."log_tag_changes"();



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."submission_tags"
    ADD CONSTRAINT "submission_tags_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."submission_tags"
    ADD CONSTRAINT "submission_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_assigned_user_id_fkey" FOREIGN KEY ("assigned_user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."statuses"("id") ON UPDATE CASCADE ON DELETE SET DEFAULT;



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON FUNCTION "public"."create_audit_log"("action" "text", "entity_id" "text", "entity_type" "text", "old_values" "jsonb", "new_values" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."create_audit_log"("action" "text", "entity_id" "text", "entity_type" "text", "old_values" "jsonb", "new_values" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_audit_log"("action" "text", "entity_id" "text", "entity_type" "text", "old_values" "jsonb", "new_values" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_auth_user_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_auth_user_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_auth_user_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_profile_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_profile_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_profile_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_profile_changes_with_context"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_profile_changes_with_context"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_profile_changes_with_context"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_public_submission"("submission_id" bigint, "name" "text", "phone" "text", "vehicle_type" "text", "budget_from" real, "budget_to" real, "ref" "text", "ip_address" "text", "user_agent" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."log_public_submission"("submission_id" bigint, "name" "text", "phone" "text", "vehicle_type" "text", "budget_from" real, "budget_to" real, "ref" "text", "ip_address" "text", "user_agent" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_public_submission"("submission_id" bigint, "name" "text", "phone" "text", "vehicle_type" "text", "budget_from" real, "budget_to" real, "ref" "text", "ip_address" "text", "user_agent" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."log_status_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_status_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_status_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_submission_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_submission_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_submission_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_submission_tag_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_submission_tag_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_submission_tag_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_tag_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_tag_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_tag_changes"() TO "service_role";


















GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."audit_logs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."audit_logs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."audit_logs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."submissions" TO "anon";
GRANT ALL ON TABLE "public"."submissions" TO "authenticated";
GRANT ALL ON TABLE "public"."submissions" TO "service_role";



GRANT ALL ON TABLE "public"."referrers" TO "anon";
GRANT ALL ON TABLE "public"."referrers" TO "authenticated";
GRANT ALL ON TABLE "public"."referrers" TO "service_role";



GRANT ALL ON TABLE "public"."statuses" TO "anon";
GRANT ALL ON TABLE "public"."statuses" TO "authenticated";
GRANT ALL ON TABLE "public"."statuses" TO "service_role";



GRANT ALL ON SEQUENCE "public"."statuses_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."statuses_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."statuses_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."submission_tags" TO "anon";
GRANT ALL ON TABLE "public"."submission_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."submission_tags" TO "service_role";



GRANT ALL ON SEQUENCE "public"."submissions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."submissions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."submissions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tags_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tags_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tags_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
