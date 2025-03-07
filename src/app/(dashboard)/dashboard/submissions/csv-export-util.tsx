import { SubmissionWithTags } from "./use-submissions";
import { Tables } from "@/types/database.types";

// Format a single submission for CSV export
export function formatSubmissionForCsv(
  submission: SubmissionWithTags,
  statuses: Tables<"statuses">[],
  tags: Tables<"tags">[],
  users: Tables<"profiles">[],
) {
  // Find status, user, and tags
  const status = statuses.find((s) => s.id === submission.status_id);
  const user = users.find((u) => u.id === submission.assigned_user_id);

  // Format tags as comma-separated string
  const submissionTags = submission.submission_tags || [];
  const tagNames = submissionTags
    .map((st) => {
      const tag = tags.find((t) => t.id === st.tag_id);
      return tag?.name;
    })
    .filter(Boolean)
    .join(", ");

  // Format date
  const createdAt = submission.created_at
    ? new Date(submission.created_at).toLocaleDateString()
    : "";

  // Return formatted object
  return {
    id: submission.id,
    name: submission.name,
    phone: submission.phone,
    vehicle_type: submission.vehicle_type,
    budget_from: submission.budget_from,
    budget_to: submission.budget_to,
    status: status?.name || "No status",
    assigned_to: user?.full_name || "Unassigned",
    referrer: submission.ref || "",
    tags: tagNames,
    created_at: createdAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function objectsToCsv(data: Record<string, any>[]): string {
  if (data.length === 0) {
    return "";
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV header row
  const headerRow = headers.join(",");

  // Create data rows
  const rows = data.map((row) => {
    return headers
      .map((header) => {
        // Convert value to string and handle commas by wrapping in quotes
        let cell = row[header]?.toString() || "";

        // Escape quotes and wrap in quotes if contains comma, quote or newline
        if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
          cell = cell.replace(/"/g, '""');
          cell = `"${cell}"`;
        }

        return cell;
      })
      .join(",");
  });

  // Combine header and rows
  return [headerRow, ...rows].join("\n");
}

// Create and trigger download of CSV file
export function downloadCsv(csvContent: string, filename: string): void {
  // Create Blob with CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create URL for Blob
  const url = URL.createObjectURL(blob);

  // Create temporary link element
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);

  // Append to document, click to download, then remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Main export function
export function exportSubmissionsToCSV(
  submissions: SubmissionWithTags[],
  statuses: Tables<"statuses">[],
  tags: Tables<"tags">[],
  users: Tables<"profiles">[],
): void {
  // Format submissions for CSV
  const formattedData = submissions.map((submission) =>
    formatSubmissionForCsv(submission, statuses, tags, users),
  );

  // Convert to CSV string
  const csvContent = objectsToCsv(formattedData);

  // Generate filename with current date
  const date = new Date().toISOString().split("T")[0];
  const filename = `submissions-export-${date}.csv`;

  // Download the CSV
  downloadCsv(csvContent, filename);
}
