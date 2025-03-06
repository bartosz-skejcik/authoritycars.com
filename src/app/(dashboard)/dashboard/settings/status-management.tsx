"use client";

import { useState } from "react";
import { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createStatus,
  deleteStatus,
  updateStatus,
} from "@/utils/services/data-service";
import { toast } from "sonner";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";

interface StatusManagementProps {
  initialStatuses: Tables<"statuses">[];
}

export function StatusManagement({ initialStatuses }: StatusManagementProps) {
  const [statuses, setStatuses] =
    useState<Tables<"statuses">[]>(initialStatuses);
  const [newStatus, setNewStatus] = useState({ name: "" });
  const [editingStatusId, setEditingStatusId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "" });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateStatus = async () => {
    if (!newStatus.name.trim()) {
      toast.error("Status name is required");
      return;
    }

    const result = await createStatus({
      name: newStatus.name.trim(),
    });

    if (result.success) {
      toast.success("Status created successfully");
      // Optimistic update
      setStatuses([
        ...statuses,
        { ...newStatus, id: Date.now(), created_at: new Date().toISOString() },
      ]);
      setNewStatus({ name: "" });
      setIsCreating(false);
    } else {
      // @ts-expect-error asdf
      toast.error(`Failed to create status: ${result.error?.message}`);
    }
  };

  const handleUpdateStatus = async (id: number) => {
    if (!editFormData.name.trim()) {
      toast.error("Status name is required");
      return;
    }

    const result = await updateStatus(id, {
      name: editFormData.name.trim(),
    });

    if (result.success) {
      toast.success("Status updated successfully");
      // Optimistic update
      setStatuses(
        statuses.map((status) =>
          status.id === id ? { ...status, name: editFormData.name } : status,
        ),
      );
      setEditingStatusId(null);
    } else {
      // @ts-expect-error asdf
      toast.error(`Failed to update status: ${result.error?.message}`);
    }
  };

  const handleDeleteStatus = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this status? This action cannot be undone.",
      )
    ) {
      return;
    }

    const result = await deleteStatus(id);

    if (result.success) {
      toast.success("Status deleted successfully");
      // Optimistic update
      setStatuses(statuses.filter((status) => status.id !== id));
    } else {
      // @ts-expect-error asdf
      toast.error(`Failed to delete status: ${result.error?.message}`);
    }
  };

  const startEditing = (status: Tables<"statuses">) => {
    setEditingStatusId(status.id);
    setEditFormData({ name: status.name });
  };

  const cancelEditing = () => {
    setEditingStatusId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Status Management</CardTitle>
              <CardDescription>
                Create, edit, and delete submission statuses
              </CardDescription>
            </div>
            {!isCreating && (
              <Button onClick={() => setIsCreating(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Status
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isCreating && (
            <div className="mb-6 rounded-lg border p-4">
              <h3 className="mb-4 text-lg font-medium">Create New Status</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="new-status-name">Name</Label>
                  <Input
                    id="new-status-name"
                    value={newStatus.name}
                    onChange={(e) => setNewStatus({ name: e.target.value })}
                    placeholder="Enter status name"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateStatus}>Create Status</Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {statuses.length === 0 ? (
              <div className="text-muted-foreground py-6 text-center">
                No statuses found. Create a status to get started.
              </div>
            ) : (
              statuses.map((status) => (
                <div
                  key={status.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  {editingStatusId === status.id ? (
                    <div className="flex w-full items-center space-x-4">
                      <Input
                        value={editFormData.name}
                        onChange={(e) =>
                          setEditFormData({ name: e.target.value })
                        }
                        placeholder="Status name"
                        className="flex-1"
                      />
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateStatus(status.id)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span>{status.name}</span>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(status)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStatus(status.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
