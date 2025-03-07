import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/database.types";

// Define types in a centralized location
export interface SubmissionWithTags extends Tables<"submissions"> {
  submission_tags: { tag_id: number }[];
}

export interface SubmissionsFilters {
  statusId: number | null;
  tagIds: number[];
  userId: string | null;
  referrers: string[];
  dateFrom: string | null;
  dateTo: string | null;
}

export function useSubmissions(filters: SubmissionsFilters) {
  const [submissions, setSubmissions] = useState<SubmissionWithTags[]>([]);
  const [statuses, setStatuses] = useState<Tables<"statuses">[]>([]);
  const [tags, setTags] = useState<Tables<"tags">[]>([]);
  const [users, setUsers] = useState<Tables<"profiles">[]>([]);
  const [referrers, setReferrers] = useState<Tables<"referrers">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    statusId,
    tagIds,
    userId,
    referrers: selectedReferrers,
    dateFrom,
    dateTo,
  } = filters;
  const client = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Start with a base query for submissions with their tags
        let query = client
          .from("submissions")
          .select("*, submission_tags(tag_id)");

        // Apply filters
        if (statusId !== null) {
          query = query.eq("status_id", statusId);
        }

        if (userId) {
          query = query.eq("assigned_user_id", userId);
        }

        if (selectedReferrers.length > 0) {
          query = query.in("ref", selectedReferrers);
        }

        // Apply date filters if provided
        if (dateFrom) {
          query = query.gte("created_at", dateFrom);
        }

        if (dateTo) {
          // Add one day to include the entire end date (up to 23:59:59)
          const nextDay = new Date(dateTo);
          nextDay.setDate(nextDay.getDate() + 1);
          const formattedNextDay = nextDay.toISOString();
          query = query.lt("created_at", formattedNextDay);
        }

        // For tag filtering, we need a specialized approach
        if (tagIds.length > 0) {
          // First get all submission IDs that have the selected tags
          const { data: filteredSubmissionIds } = await client
            .from("submission_tags")
            .select("submission_id")
            .in("tag_id", tagIds);

          if (filteredSubmissionIds && filteredSubmissionIds.length > 0) {
            // Then filter the main query to only include these submission IDs
            const submissionIds = filteredSubmissionIds.map(
              (item) => item.submission_id,
            );
            query = query.in("id", submissionIds);
          } else {
            // If no submissions match the tag filter, return early with empty array
            setSubmissions([]);
            setLoading(false);
            return;
          }
        }

        // Fetch all data in parallel
        const [
          { data: submissionsData, error: submissionsError },
          { data: statusesData },
          { data: tagsData },
          { data: usersData },
          { data: referersData },
        ] = await Promise.all([
          query,
          client.from("statuses").select("*"),
          client.from("tags").select("*"),
          client.from("profiles").select("*"),
          client.from("referrers").select("*"),
        ]);

        if (submissionsError) throw new Error(submissionsError.message);

        setSubmissions(submissionsData || []);
        setStatuses(statusesData || []);
        setTags(tagsData || []);
        setUsers(usersData || []);
        setReferrers(referersData || []);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
        console.error("Error fetching submissions data:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [statusId, tagIds, userId, client, selectedReferrers, dateFrom, dateTo]);

  return {
    submissions,
    statuses,
    tags,
    users,
    referrers,
    loading,
    error,
  };
}
