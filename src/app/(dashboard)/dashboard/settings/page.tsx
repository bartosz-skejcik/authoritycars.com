"use client";

import { TagManagement } from "./tag-management";
import { StatusManagement } from "./status-management";
import { ContactsManagement } from "./contacts-management";
import { VerticalTabs } from "@/components/ui/vertical-tabs";
import {
  getTags,
  getStatuses,
  getAllAccounts,
} from "@/utils/services/data-service";
import { useState, useEffect } from "react";
import { Tables } from "@/types/database.types";
import Link from "next/link";
import AccountManagement from "./account-management";

export default function SettingsPage() {
  const [tags, setTags] = useState<Tables<"tags">[]>([]);
  const [statuses, setStatuses] = useState<Tables<"statuses">[]>([]);
  const [accounts, setAccounts] = useState<Tables<"profiles">[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAsyncData = async () => {
      setIsLoading(true);
      try {
        const [fetchedTags, fetchedStatuses, fetchedAccounts] =
          await Promise.all([getTags(), getStatuses(), getAllAccounts()]);

        setTags(fetchedTags);
        setStatuses(fetchedStatuses);
        setAccounts(fetchedAccounts);
      } catch (error) {
        console.error("Failed to load settings data:", error);
      } finally {
        setIsLoading(false);
      }
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
    {
      id: "account-management",
      title: "Account Management",
      content: <AccountManagement accounts={accounts} />,
    },
    {
      id: "contacts-management",
      title: "Contact Information",
      content: <ContactsManagement />,
    },
  ];

  return (
    <div className="container mx-auto max-w-11/12 space-y-18 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your tags, statuses, contact information, and dashboard
          preferences. If you are looking for Account settings, please visit{" "}
          <Link href="/dashboard/account" className="text-orange-500">
            your profile
          </Link>
          .
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse">Loading settings...</div>
        </div>
      ) : (
        <VerticalTabs tabs={tabs} defaultValue={tabs[0].id} />
      )}
    </div>
  );
}
