"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables, TablesInsert } from "@/types/database.types";

// Tag management
export async function getTags() {
  const supabase = await createClient();

  const { data } = await supabase.from("tags").select().order("name");
  return data || [];
}

export async function createTag(tag: TablesInsert<"tags">) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("tags")
      .insert([tag])
      .select()
      .single();
    return { success: !error, data, error };
  } catch (error) {
    return { success: false, error };
  }
}

export async function updateTag(
  id: number,
  tag: Partial<TablesInsert<"tags">>,
) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("tags")
      .update(tag)
      .eq("id", id)
      .select()
      .single();
    return { success: !error, data, error };
  } catch (error) {
    return { success: false, error };
  }
}

export async function deleteTag(id: number) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("tags").delete().eq("id", id);
    return { success: !error, error };
  } catch (error) {
    return { success: false, error };
  }
}

// Status management
export async function getStatuses() {
  const supabase = await createClient();

  const { data } = await supabase.from("statuses").select().order("name");
  return data || [];
}

export async function createStatus(status: TablesInsert<"statuses">) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("statuses")
      .insert([status])
      .select()
      .single();
    return { success: !error, data, error };
  } catch (error) {
    return { success: false, error };
  }
}

export async function updateStatus(
  id: number,
  status: Partial<TablesInsert<"statuses">>,
) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("statuses")
      .update(status)
      .eq("id", id)
      .select()
      .single();
    return { success: !error, data, error };
  } catch (error) {
    return { success: false, error };
  }
}

export async function deleteStatus(id: number) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("statuses").delete().eq("id", id);
    return { success: !error, error };
  } catch (error) {
    return { success: false, error };
  }
}

// Audit log management
export async function getAuditLogs(limit = 10) {
  const supabase = await createClient();

  let query = supabase
    .from("audit_logs")
    .select(
      `
      *,
      profiles (
        id,
        full_name,
        avatar_url
      )
    `,
    )
    .order("timestamp", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data } = await query;
  return data || [];
}

export async function createAuditLog(action: string) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return { success: false };
  }

  const { error } = await supabase.from("audit_logs").insert({
    action,
    user_id: user.user.id,
  });

  if (error) {
    console.error("Error creating audit log:", error);
    return { success: false };
  }

  return { success: true };
}

// Submission management
export async function getSubmissions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: Record<string, any>,
  page = 0,
  pageSize = 10,
) {
  const supabase = await createClient();

  let query = supabase
    .from("submissions")
    .select(
      `
      *,
      statuses (
        id,
        name
      ),
      assigned_user:profiles (
        id,
        full_name,
        avatar_url
      )
    `,
    )
    .order("created_at", { ascending: false });

  // Apply filters if provided
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (key === "status_id") {
          query = query.eq("status_id", value);
        } else if (key === "vehicle_type") {
          query = query.eq("vehicle_type", value);
        }
      }
    });
  }

  // Apply pagination
  const from = page * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching submissions:", error);
    return { data: [], count: 0 };
  }

  // Get tags for each submission
  const submissionIds = data.map((submission) => submission.id);

  if (submissionIds.length > 0) {
    const { data: submissionTags } = await supabase
      .from("submission_tags")
      .select(
        `
        submission_id,
        tags (
          id,
          name,
          hex
        )
      `,
      )
      .in("submission_id", submissionIds);

    // Add tags to submissions
    data.forEach((submission) => {
      const tags = submissionTags
        ?.filter((st) => st.submission_id === submission.id)
        .map((st) => st.tags);

      // @ts-expect-error asdf
      submission.tags = tags || [];
    });

    // Apply tag filter if provided
    if (filters?.tag_id) {
      return {
        data: data.filter((submission) =>
          // @ts-expect-error asdf
          submission.tags.some((tag) => tag.id === Number(filters.tag_id)),
        ),
        count: count || 0,
      };
    }
  }

  return { data, count: count || 0 };
}

export async function getSubmissionById(id: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("submissions")
    .select(
      `
      *,
      statuses (
        id,
        name
      ),
      assigned_user:profiles (
        id,
        full_name,
        avatar_url
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching submission:", error);
    return null;
  }

  // Get tags for the submission
  const { data: submissionTags } = await supabase
    .from("submission_tags")
    .select(
      `
      tags (
        id,
        name,
        hex
      )
    `,
    )
    .eq("submission_id", id);

  // Add tags to submission
  // @ts-expect-error asdf
  data.tags = submissionTags?.map((st) => st.tags) || [];

  return data;
}

export async function updateSubmission(
  id: number,
  submission: Partial<Tables<"submissions">>,
) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("submissions")
      .update(submission)
      .eq("id", id)
      .select()
      .single();
    return { success: !error, data, error };
  } catch (error) {
    return { success: false, error };
  }
}

export async function updateSubmissionTags(id: number, tagIds: number[]) {
  const supabase = await createClient();

  try {
    // First, delete all existing submission_tags for this submission
    await supabase.from("submission_tags").delete().eq("submission_id", id);

    // Then insert new submission_tags
    if (tagIds.length > 0) {
      const { error } = await supabase
        .from("submission_tags")
        .insert(tagIds.map((tag_id) => ({ submission_id: id, tag_id })));

      return { success: !error, error };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

// Profile management
export async function getProfiles() {
  const supabase = await createClient();

  const { data } = await supabase.from("profiles").select().order("full_name");
  return data || [];
}

export async function updateProfile(
  userId: string,
  update: { full_name?: string; avatar_url?: string },
) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(update)
      .eq("id", userId)
      .select()
      .single();
    return { success: !error, data, error };
  } catch (error) {
    return { success: false, error };
  }
}

export async function getCurrentUser() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data: profile } = await supabase
      .from("profiles")
      .select()
      .eq("id", user.id)
      .single();

    return { user, profile };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Dashboard statistics
export async function getSubmissionCountsByStatus() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return [];
  }

  // Query all available statuses and count submissions for each status in a single query
  const { data, error } = await supabase
    .from("statuses")
    .select(
      `
      id,
      name,
      submissions:submissions(count)
    `,
    )
    .order("id");

  if (error) {
    console.error("Error fetching statuses with counts:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Format the results
  return data.map((status) => ({
    id: status.id,
    name: status.name,
    count: status.submissions[0].count || 0,
  }));
}

export async function getSubmissionsStatusChange() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return [];
  }

  // Calculate date ranges for this month and last month
  const now = new Date();

  // Last month: from the 1st of previous month to the last day of previous month
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // Format dates for Supabase queries
  const lastMonthStartStr = lastMonthStart.toISOString();
  const lastMonthEndStr = lastMonthEnd.toISOString();

  // Get all statuses with current counts
  const { data, error } = await supabase
    .from("statuses")
    .select(
      `
      id,
      name,
      submissions(count)
    `,
    )
    .order("id");

  if (error || !data) {
    console.error("Error fetching statuses with counts:", error);
    return [];
  }

  // Get all submissions from last month
  const { data: lastMonthSubmissions, error: lastMonthError } = await supabase
    .from("submissions")
    .select("status_id")
    .gte("created_at", lastMonthStartStr)
    .lte("created_at", lastMonthEndStr);

  if (lastMonthError) {
    console.error("Error fetching last month's submissions:", lastMonthError);
    return [];
  }

  // Count last month submissions by status_id
  const lastMonthCounts = {};
  lastMonthSubmissions?.forEach((submission) => {
    if (submission.status_id) {
      // @ts-expect-error asdf
      lastMonthCounts[submission.status_id] =
        // @ts-expect-error asdf
        (lastMonthCounts[submission.status_id] || 0) + 1;
    }
  });

  // Combine the data
  return data.map((status) => {
    const currentCount = status.submissions[0]?.count || 0;
    // @ts-expect-error asdf
    const lastMonthCount = lastMonthCounts[status.id] || 0;

    // Calculate percentage change
    let percentChange = 0;
    if (lastMonthCount > 0) {
      percentChange = ((currentCount - lastMonthCount) / lastMonthCount) * 100;
    } else if (currentCount > 0) {
      // If last month was 0 and this month has submissions, that's a 100% increase
      percentChange = 100;
    }

    return {
      id: status.id,
      name: status.name,
      count: status.submissions[0]?.count || 0,
      percentChange: Math.round(percentChange),
      increased: percentChange >= 0,
    };
  });
}
