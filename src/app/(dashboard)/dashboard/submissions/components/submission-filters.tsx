"use client";

import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  CalendarSearch,
  Filter,
  TagIcon,
  TicketSlash,
  UserCircle,
  XIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import MultiSelect from "@/features/ui/multi-select";
import { Option } from "@/components/ui/multiselect";
import { Tables } from "@/types/database.types";
import { useCallback } from "react";
import { getContrastText } from "../tag-utils";
import { SubmissionsFilters } from "../use-submissions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SubmissionFiltersProps {
  statuses: Tables<"statuses">[];
  tags: Tables<"tags">[];
  users: Tables<"profiles">[];
  referrers: Tables<"referrers">[];
  filters: SubmissionsFilters;
  onFiltersChange: (newFilters: SubmissionsFilters) => void;
}

export function SubmissionFilters({
  statuses,
  tags,
  users,
  referrers,
  filters,
  onFiltersChange,
}: SubmissionFiltersProps) {
  // Convert filters to component state
  const { statusId, userId, dateFrom, dateTo } = filters;

  // Helper function to update filters
  const updateFilters = useCallback(
    (updatedValues: Partial<SubmissionsFilters>) => {
      onFiltersChange({
        ...filters,
        ...updatedValues,
      });
    },
    [filters, onFiltersChange],
  );

  // Prepare options for select components
  const tagOptions: Option[] = tags.map((tag) => ({
    value: tag.id.toString(),
    label: tag.name,
    style: { backgroundColor: tag.hex, color: getContrastText(tag.hex) },
  }));

  const referrerOptions: Option[] = referrers.map((ref) => ({
    value: ref.ref ? ref.ref : "all",
    label: ref.ref ? ref.ref.charAt(0).toUpperCase() + ref.ref.slice(1) : "All",
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Filters</CardTitle>
        <CardDescription>
          Filter activity logs by user, action, or time period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="3xl:grid-cols-6 grid gap-4 md:grid-cols-3">
          {/* Status Filter */}
          <div className="flex items-end gap-1">
            <div className="w-full space-y-2">
              <div className="flex items-center gap-2">
                <Filter className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">Status</span>
              </div>
              <Select
                value={statusId?.toString() || ""}
                onValueChange={(value) => {
                  updateFilters({
                    statusId: value ? parseInt(value, 10) : null,
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
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
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateFilters({ statusId: null })}
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* User Filter */}
          <div className="flex items-end gap-1">
            <div className="w-full space-y-2">
              <div className="flex items-center gap-2">
                <UserCircle className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">User</span>
              </div>
              <Select
                value={userId || ""}
                onValueChange={(value) => {
                  updateFilters({
                    userId: value || null,
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by assigned user" />
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
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateFilters({ userId: null })}
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Tags Filter */}
          <div className="w-full space-y-2">
            <div className="flex items-center gap-2">
              <TagIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">Tags</span>
            </div>
            <MultiSelect
              values={tagOptions}
              placeholder="Filter by tags"
              onChange={(value: Option[] | undefined) => {
                updateFilters({
                  tagIds: (value || []).map((v) => parseInt(v.value, 10)),
                });
              }}
            />
          </div>

          {/* Referrers Filter */}
          <div className="w-full space-y-2">
            <div className="flex items-center gap-2">
              <TicketSlash className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">Referrer</span>
            </div>
            <MultiSelect
              values={referrerOptions}
              placeholder="Filter by referrers"
              onChange={(value: Option[] | undefined) => {
                updateFilters({
                  referrers: value ? value.map((v) => v.value) : [],
                });
              }}
            />
          </div>

          {/* Date From Filter */}
          <div className="w-full space-y-2">
            <div className="flex items-center gap-2">
              <CalendarSearch className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">Starting date</span>
            </div>
            <div className="flex gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-card text-muted-foreground h-9.5! grow justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(new Date(dateFrom), "PPP") : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom ? new Date(dateFrom) : undefined}
                    onSelect={(date) =>
                      updateFilters({
                        dateFrom: date ? date.toISOString() : null,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {dateFrom && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateFilters({ dateFrom: null })}
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Date To Filter */}
          <div className="w-full space-y-2">
            <div className="flex items-center gap-2">
              <CalendarSearch className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">Ending date</span>
            </div>
            <div className="flex gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-card text-muted-foreground h-9.5! grow justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(new Date(dateTo), "PPP") : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo ? new Date(dateTo) : undefined}
                    onSelect={(date) =>
                      updateFilters({
                        dateTo: date ? date.toISOString() : null,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {dateTo && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateFilters({ dateTo: null })}
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
