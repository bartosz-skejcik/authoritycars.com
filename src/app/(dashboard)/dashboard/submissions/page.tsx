"use client";

import { SubmissionsTable } from "@/app/(dashboard)/dashboard/submissions/submissions-table";

export default function SubmissionsPage() {
  return (
    <div className="container mx-auto max-w-11/12 space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
        <p className="text-muted-foreground">
          View and manage all submissions here.
        </p>
      </div>

      <SubmissionsTable />
    </div>
  );
}
