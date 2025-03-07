import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { SubmissionWithTags } from "./use-submissions";

interface SubmissionUpdateParams {
  submissionId: number;
  statusId: number | null;
  userId: string | null;
  tagIds: number[];
}

export function useSubmissionMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const client = createClient();

  const updateSubmission = async (
    params: SubmissionUpdateParams,
  ): Promise<SubmissionWithTags | null> => {
    const { submissionId, statusId, userId, tagIds } = params;
    setLoading(true);
    setError(null);

    try {
      // Update submission status and assigned user
      const { error: submissionError } = await client
        .from("submissions")
        .update({
          status_id: statusId,
          assigned_user_id: userId,
        })
        .eq("id", submissionId);

      if (submissionError) throw new Error(submissionError.message);

      // Delete existing tags
      const { error: deleteError } = await client
        .from("submission_tags")
        .delete()
        .eq("submission_id", submissionId);

      if (deleteError) throw new Error(deleteError.message);

      // Insert new tags if any
      if (tagIds.length > 0) {
        const { error: insertError } = await client
          .from("submission_tags")
          .insert(
            tagIds.map((tagId) => ({
              submission_id: submissionId,
              tag_id: tagId,
            })),
          );

        if (insertError) throw new Error(insertError.message);
      }

      // Fetch the updated submission
      const { data, error: fetchError } = await client
        .from("submissions")
        .select("*, submission_tags(tag_id)")
        .eq("id", submissionId)
        .single();

      if (fetchError) throw new Error(fetchError.message);

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unknown error during submission update";
      setError(new Error(errorMessage));
      console.error("Error updating submission:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateSubmission,
    loading,
    error,
  };
}
