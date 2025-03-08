"use client";

import { AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

type Props = {
  avatar_url: string | null | undefined;
  alt: string;
};

function Avatar({ avatar_url, alt }: Props) {
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      if (!avatar_url) return;

      return supabase.storage
        .from("avatars")
        .download(avatar_url)
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }

          const url = URL.createObjectURL(data);

          setProfileAvatar(url);
        });
    })();
  }, [avatar_url]);
  return <AvatarImage src={profileAvatar || ""} alt={alt} />;
}

export { Avatar };
