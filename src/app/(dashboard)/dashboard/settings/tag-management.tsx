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
import { createTag, deleteTag, updateTag } from "@/utils/services/data-service";
import { toast } from "sonner";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";

interface TagManagementProps {
  initialTags: Tables<"tags">[];
}

export function TagManagement({ initialTags }: TagManagementProps) {
  const [tags, setTags] = useState<Tables<"tags">[]>(initialTags);
  const [newTag, setNewTag] = useState({ name: "", hex: "#3B82F6" });
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", hex: "" });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTag = async () => {
    if (!newTag.name.trim()) {
      toast.error("Tag name is required");
      return;
    }

    const result = await createTag({
      name: newTag.name.trim(),
      hex: newTag.hex || "#3B82F6",
    });

    if (result.success) {
      toast.success("Tag created successfully");
      // Optimistic update
      setTags([
        ...tags,
        { ...newTag, id: Date.now(), created_at: new Date().toISOString() },
      ]);
      setNewTag({ name: "", hex: "#3B82F6" });
      setIsCreating(false);
    } else {
      // @ts-expect-error asdf
      toast.error(`Failed to create tag: ${result.error?.message}`);
    }
  };

  const handleUpdateTag = async (id: number) => {
    if (!editFormData.name.trim()) {
      toast.error("Tag name is required");
      return;
    }

    const result = await updateTag(id, {
      name: editFormData.name.trim(),
      hex: editFormData.hex,
    });

    if (result.success) {
      toast.success("Tag updated successfully");
      // Optimistic update
      setTags(
        tags.map((tag) =>
          tag.id === id
            ? { ...tag, name: editFormData.name, hex: editFormData.hex }
            : tag,
        ),
      );
      setEditingTagId(null);
    } else {
      // @ts-expect-error asdf
      toast.error(`Failed to update tag: ${result.error?.message}`);
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this tag? This action cannot be undone.",
      )
    ) {
      return;
    }

    const result = await deleteTag(id);

    if (result.success) {
      toast.success("Tag deleted successfully");
      // Optimistic update
      setTags(tags.filter((tag) => tag.id !== id));
    } else {
      // @ts-expect-error asdf
      toast.error(`Failed to delete tag: ${result.error?.message}`);
    }
  };

  const startEditing = (tag: Tables<"tags">) => {
    setEditingTagId(tag.id);
    setEditFormData({ name: tag.name, hex: tag.hex });
  };

  const cancelEditing = () => {
    setEditingTagId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tag Management</CardTitle>
              <CardDescription>Create, edit, and delete tags</CardDescription>
            </div>
            {!isCreating && (
              <Button onClick={() => setIsCreating(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Tag
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isCreating && (
            <div className="mb-6 rounded-lg border p-4">
              <h3 className="mb-4 text-lg font-medium">Create New Tag</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="new-tag-name" className="pb-2">
                      Name
                    </Label>
                    <Input
                      id="new-tag-name"
                      value={newTag.name}
                      onChange={(e) =>
                        setNewTag({ ...newTag, name: e.target.value })
                      }
                      placeholder="Enter tag name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-tag-color" className="pb-2">
                      Color
                    </Label>
                    <div className="flex">
                      <Input
                        id="new-tag-color"
                        type="color"
                        value={newTag.hex}
                        onChange={(e) =>
                          setNewTag({ ...newTag, hex: e.target.value })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTag}>Create Tag</Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {tags.length === 0 ? (
              <div className="text-muted-foreground py-6 text-center">
                No tags found. Create a tag to get started.
              </div>
            ) : (
              tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  {editingTagId === tag.id ? (
                    <div className="flex w-full items-center space-x-4">
                      <div className="grid flex-1 grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <Input
                            value={editFormData.name}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                name: e.target.value,
                              })
                            }
                            placeholder="Tag name"
                          />
                        </div>
                        <div>
                          <Input
                            type="color"
                            value={editFormData.hex}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                hex: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
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
                          onClick={() => handleUpdateTag(tag.id)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: tag.hex }}
                        />
                        <span>{tag.name}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(tag)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTag(tag.id)}
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
