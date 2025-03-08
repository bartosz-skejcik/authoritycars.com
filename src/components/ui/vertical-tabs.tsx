"use client";

import type * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VerticalTabsProps {
  tabs: {
    id: string;
    title: string;
    content: React.ReactNode;
  }[];
  defaultValue?: string;
}

export function VerticalTabs({ tabs, defaultValue }: VerticalTabsProps) {
  // Use the first tab's id as the default value if not provided
  const defaultTab = defaultValue || (tabs[0]?.id ?? "");

  return (
    <Tabs
      defaultValue={`tab-${defaultTab}`}
      orientation="vertical"
      className="w-full flex-row"
    >
      <TabsList className="flex-col gap-1 bg-transparent py-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={`tab-${tab.id}`}
            className="data-[state=active]:bg-muted text-md w-full cursor-pointer justify-start data-[state=active]:shadow-none"
          >
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="-mt-13 grow">
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={`tab-${tab.id}`}>
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
