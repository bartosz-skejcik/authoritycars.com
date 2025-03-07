"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download } from "lucide-react";
import { exportSubmissionsToCSV } from "./csv-export-util";
import {
  SubmissionWithTags,
  SubmissionsFilters,
  useSubmissions,
} from "./use-submissions";
import { useSubmissionMutations } from "./use-submissions-mutation";
import { SubmissionFilters } from "./components/submission-filters";
import { SubmissionEditDialog } from "./submission-edit-dialog";
import { TagsList } from "./components/tags-list";
import { Card, CardContent } from "@/components/ui/card";

export function SubmissionsTable() {
  // Initial state for filters with the new date fields
  const [filters, setFilters] = useState<SubmissionsFilters>({
    statusId: null,
    tagIds: [],
    userId: null,
    referrers: [],
    dateFrom: null,
    dateTo: null,
  });

  // State for selected submission
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionWithTags | null>(null);

  // Use our custom hooks
  const { submissions, statuses, tags, users, referrers, loading } =
    useSubmissions(filters);

  const { updateSubmission } = useSubmissionMutations();

  // Handler for submission updates
  const handleSubmissionUpdate = async (
    submissionId: number,
    statusId: number | null,
    userId: string | null,
    tagIds: number[],
  ) => {
    const updatedSubmission = await updateSubmission({
      submissionId,
      statusId,
      userId,
      tagIds,
    });

    // If this is the currently selected submission, update it
    if (updatedSubmission && selectedSubmission?.id === submissionId) {
      setSelectedSubmission(updatedSubmission);
    }
  };

  // Define table columns
  const columns: ColumnDef<SubmissionWithTags>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "vehicle_type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "status_id",
      header: "Status",
      cell: ({ row }) => {
        const status = statuses.find((s) => s.id === row.getValue("status_id"));
        return status?.name || "No status";
      },
    },
    {
      accessorKey: "assigned_user_id",
      header: "Assigned To",
      cell: ({ row }) => {
        const user = users.find(
          (u) => u.id === row.getValue("assigned_user_id"),
        );
        return user?.full_name || "Unassigned";
      },
    },
    {
      accessorKey: "ref",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Referrer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "submission_tags",
      header: "Tags",
      cell: ({ row }) => {
        const submissionTags = row.getValue("submission_tags") as {
          tag_id: number;
        }[];
        return <TagsList submissionTags={submissionTags} allTags={tags} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => setSelectedSubmission(row.original)}
          >
            View/Edit
          </Button>
        );
      },
    },
  ];

  // Handler for CSV export
  const handleExportCsv = () => {
    exportSubmissionsToCSV(submissions, statuses, tags, users);
  };

  return (
    <div className="space-y-4">
      {/* Filters Component */}
      <SubmissionFilters
        statuses={statuses}
        tags={tags}
        users={users}
        referrers={referrers}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Export Button and Table */}
      <Card className="py-0">
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p>Loading submissions...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={submissions}
              searchColumn="name"
              searchPlaceholder="Search submissions..."
              searchClassName="col-span-2"
              extraComponents={
                <Button
                  onClick={handleExportCsv}
                  variant="success"
                  className="-mt-0.5 h-9.5 w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export to CSV
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {selectedSubmission && (
        <SubmissionEditDialog
          open={!!selectedSubmission}
          onOpenChange={(open) => !open && setSelectedSubmission(null)}
          submission={selectedSubmission}
          statuses={statuses}
          tags={tags}
          users={users}
          onSubmissionUpdate={handleSubmissionUpdate}
        />
      )}
    </div>
  );
}
