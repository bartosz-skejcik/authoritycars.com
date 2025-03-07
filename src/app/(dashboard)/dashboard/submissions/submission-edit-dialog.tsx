"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tables } from "@/types/database.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Define the submission type that includes tags
type SubmissionWithTags = Tables<"submissions"> & {
  submission_tags: { tag_id: number }[];
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: SubmissionWithTags; // Updated type
  statuses: Tables<"statuses">[];
  tags: Tables<"tags">[];
  users: Tables<"profiles">[];
  onSubmissionUpdate: (
    submissionId: number,
    statusId: number | null,
    userId: string | null,
    tagIds: number[],
  ) => Promise<void>;
}

export function SubmissionEditDialog({
  open,
  onOpenChange,
  submission,
  statuses,
  tags,
  users,
  onSubmissionUpdate,
}: Props) {
  const submissionTags = Array.isArray(submission.submission_tags)
    ? submission.submission_tags.map((st) => st.tag_id)
    : [];

  const handleTagClick = (tagId: number) => {
    const newTags = submissionTags.includes(tagId)
      ? submissionTags.filter((id: number) => id !== tagId)
      : [...submissionTags, tagId];

    onSubmissionUpdate(
      submission.id,
      submission.status_id,
      submission.assigned_user_id,
      newTags,
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>View/Edit Submission</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <div className="mb-2 space-y-2">
              <p>Name: {submission.name}</p>
              <p>Phone: {submission.phone}</p>
              <p>Type: {submission.vehicle_type}</p>
              <p>Referrer: {submission.ref}</p>
              <p>
                Budget Range: {submission.budget_from} - {submission.budget_to}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 space-y-2">
                <Label>Status</Label>
                <Select
                  defaultValue={submission.status_id?.toString()}
                  onValueChange={(value) => {
                    onSubmissionUpdate(
                      submission.id,
                      value ? parseInt(value, 10) : null,
                      submission.assigned_user_id,
                      submissionTags,
                    );
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.id} value={status.id.toString()}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-1 space-y-2">
                <Label>Assigned User</Label>
                <Select
                  defaultValue={submission.assigned_user_id || undefined}
                  onValueChange={(value) => {
                    onSubmissionUpdate(
                      submission.id,
                      submission.status_id,
                      value || null,
                      submissionTags,
                    );
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Assign to user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name || user.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const isSelected = submissionTags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => handleTagClick(tag.id)}
                        className="border-input hover:bg-accent hover:text-accent-foreground inline-flex h-7 items-center rounded-md border-2 px-2 text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: isSelected ? tag.hex : "transparent",
                          color: isSelected
                            ? getContrastText(tag.hex)
                            : undefined,
                          borderColor: tag.hex,
                        }}
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to determine text color based on background
function getContrastText(bgColor: string): string {
  // Remove # if present
  const hex = bgColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}
