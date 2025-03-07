"use client";

import { TagManagement } from "./tag-management";
import { StatusManagement } from "./status-management";
import { VerticalTabs } from "@/components/ui/vertical-tabs";
import { getTags, getStatuses } from "@/utils/services/data-service";
import { useState, useEffect } from "react";
import { Tables } from "@/types/database.types";
import Link from "next/link";

export default function SettingsPage() {
  const [tags, setTags] = useState<Tables<"tags">[]>([]);
  const [statuses, setStatuses] = useState<Tables<"statuses">[]>([]);

  useEffect(() => {
    const loadAsyncData = async () => {
      const [fetchedTags, fetchedStatuses] = await Promise.all([
        getTags(),
        getStatuses(),
      ]);

      setTags(fetchedTags);
      setStatuses(fetchedStatuses);
    };

    loadAsyncData();
  }, []);

  const tabs = [
    {
      id: "tag-management",
      title: "Tag Management",
      content: <TagManagement initialTags={tags} />,
    },
    {
      id: "status-management",
      title: "Status Management",
      content: <StatusManagement initialStatuses={statuses} />,
    },
  ];

  return (
    <div className="container mx-auto max-w-11/12 space-y-12 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your tags, statuses, and dashboard preferences. If you are
          looking for Account settings, please visit{" "}
          <Link href="/dashboard/account" className="text-red-500">
            your profile
          </Link>
          .
        </p>
      </div>

      {tags.length > 0 && statuses.length > 0 ? (
        <VerticalTabs tabs={tabs} defaultValue={tabs[0].id} />
      ) : (
        "Loading..."
      )}
    </div>
  );
}
