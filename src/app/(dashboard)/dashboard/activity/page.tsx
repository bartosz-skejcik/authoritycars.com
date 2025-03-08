"use client";

import { Avatar as AvatarComponent } from "./avatar";
import { useCallback, useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Search,
  Filter,
  RefreshCw,
  Calendar,
  UserCircle,
  Info,
} from "lucide-react";
import { getAuditLogs } from "@/utils/services/data-service";
import { useDebounce } from "use-debounce";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Activity type definition
type ActivityLog = {
  id: number;
  timestamp: string;
  action: string;
  user_id: string | null;
  entity_id?: string;
  entity_type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  old_values?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new_values?: Record<string, any>;
  submitter_name?: string;
  ip_address?: string;
  user_agent?: string;
  profiles?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

const PAGE_SIZE = 20;

function formatAction(action: string): string {
  return action
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getActionBadgeColor(action: string): string {
  if (action.includes("created") || action.includes("added")) {
    return "bg-green-100 text-green-800 hover:bg-green-200";
  } else if (action.includes("updated") || action.includes("changed")) {
    return "bg-blue-100 text-blue-800 hover:bg-blue-200";
  } else if (action.includes("deleted") || action.includes("removed")) {
    return "bg-red-100 text-red-800 hover:bg-red-200";
  } else {
    return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}

function ActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [actionFilter, setActionFilter] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [uniqueUsers, setUniqueUsers] = useState<
    { id: string; name: string | null }[]
  >([]);
  const [uniqueActions, setUniqueActions] = useState<string[]>([]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      // In a real implementation, you would pass filters and pagination params
      // For now, we'll fetch all logs and filter client-side
      const allLogs = await getAuditLogs(0); // Pass 0 to get all logs instead of limited

      // Apply filters client-side (in production, do this server-side)
      let filteredLogs = [...allLogs];

      if (debouncedSearchTerm) {
        filteredLogs = filteredLogs.filter(
          (log) =>
            log.action
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()) ||
            log.profiles?.full_name
              ?.toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()),
        );
      }

      if (actionFilter) {
        filteredLogs = filteredLogs.filter(
          (log) => log.action === actionFilter,
        );
      }

      if (userFilter) {
        filteredLogs = filteredLogs.filter((log) => log.user_id === userFilter);
      }

      if (dateFilter) {
        const today = new Date();
        const filterDate = new Date(today);

        switch (dateFilter) {
          case "today":
            filterDate.setHours(0, 0, 0, 0);
            filteredLogs = filteredLogs.filter(
              (log) => new Date(log.timestamp) >= filterDate,
            );
            break;
          case "yesterday":
            filterDate.setDate(today.getDate() - 1);
            filterDate.setHours(0, 0, 0, 0);
            const yesterdayEnd = new Date(today);
            yesterdayEnd.setHours(0, 0, 0, 0);
            filteredLogs = filteredLogs.filter(
              (log) =>
                new Date(log.timestamp) >= filterDate &&
                new Date(log.timestamp) < yesterdayEnd,
            );
            break;
          case "thisWeek":
            filterDate.setDate(today.getDate() - today.getDay());
            filterDate.setHours(0, 0, 0, 0);
            filteredLogs = filteredLogs.filter(
              (log) => new Date(log.timestamp) >= filterDate,
            );
            break;
          case "thisMonth":
            filterDate.setDate(1);
            filterDate.setHours(0, 0, 0, 0);
            filteredLogs = filteredLogs.filter(
              (log) => new Date(log.timestamp) >= filterDate,
            );
            break;
        }
      }

      // Calculate pagination
      const totalItems = filteredLogs.length;
      const calculatedTotalPages = Math.ceil(totalItems / PAGE_SIZE);

      setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);

      // Apply pagination manually
      const startIdx = (currentPage - 1) * PAGE_SIZE;
      const paginatedLogs = filteredLogs.slice(startIdx, startIdx + PAGE_SIZE);

      // @ts-expect-error asdf
      setLogs(paginatedLogs);

      // Extract unique users and actions for filters
      const users = Array.from(
        new Set(
          allLogs
            .filter((log) => log.profiles?.full_name)
            .map((log) =>
              JSON.stringify({
                id: log.user_id,
                name: log.profiles?.full_name,
              }),
            ),
        ),
      ).map((user) => JSON.parse(user));

      const actions = Array.from(new Set(allLogs.map((log) => log.action)));

      setUniqueUsers(users);
      setUniqueActions(actions);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, actionFilter, userFilter, dateFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const resetFilters = () => {
    setSearchTerm("");
    setActionFilter("");
    setUserFilter("");
    setDateFilter("");
    setCurrentPage(1);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <div className="container mx-auto max-w-11/12 space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-muted-foreground">
            Track all user actions and system changes
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchLogs}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Filters</CardTitle>
          <CardDescription>
            Filter activity logs by user, action, or time period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Search className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">Search</span>
              </div>
              <Input
                placeholder="Search by action or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Filter className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">Action Type</span>
              </div>
              <Select
                value={actionFilter}
                onValueChange={(value) => {
                  setActionFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {formatAction(action)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserCircle className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">User</span>
              </div>
              <Select
                value={userFilter}
                onValueChange={(value) => {
                  setUserFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name || "Unknown User"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">Time Period</span>
              </div>
              <Select
                value={dateFilter}
                onValueChange={(value) => {
                  setDateFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(searchTerm || actionFilter || userFilter || dateFilter) && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Log Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/40 border-b">
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
                <th className="px-4 py-3 text-left font-medium">Date & Time</th>
                <th className="px-4 py-3 text-right font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-36" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Skeleton className="ml-auto h-8 w-8 rounded-full" />
                    </td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center justify-center space-y-3 text-center">
                      <div className="bg-muted rounded-full p-3">
                        <Info className="text-muted-foreground h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">
                          No activities found
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {searchTerm ||
                          actionFilter ||
                          userFilter ||
                          dateFilter
                            ? "Try adjusting your filters or search term"
                            : "Activity logs will appear here when users perform actions"}
                        </p>
                      </div>
                      {(searchTerm ||
                        actionFilter ||
                        userFilter ||
                        dateFilter) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetFilters}
                        >
                          Reset Filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                // Data rows
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/50 border-b">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarComponent
                            avatar_url={log.profiles?.avatar_url}
                            alt={
                              log.profiles?.full_name ||
                              log.submitter_name ||
                              ""
                            }
                          />
                          <AvatarFallback>
                            {(log.profiles?.full_name ||
                              log.submitter_name ||
                              "User")[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {log.profiles?.full_name ||
                            log.submitter_name ||
                            "Unknown User"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={getActionBadgeColor(log.action)}
                      >
                        {formatAction(log.action)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-muted-foreground cursor-default">
                              {formatDistanceToNow(new Date(log.timestamp), {
                                addSuffix: true,
                              })}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {format(new Date(log.timestamp), "PPpp")}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Activity Details</DialogTitle>
                            <DialogDescription>
                              Details of activity logged at{" "}
                              {format(new Date(log.timestamp), "PPpp")}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarComponent
                                  avatar_url={log.profiles?.avatar_url}
                                  alt={
                                    log.profiles?.full_name ||
                                    log.submitter_name ||
                                    ""
                                  }
                                />
                                <AvatarFallback>
                                  {(log.profiles?.full_name ||
                                    log.submitter_name ||
                                    "User")[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {log.profiles?.full_name ||
                                    log.submitter_name ||
                                    "Unknown User"}
                                </p>
                                {log.user_id ? (
                                  <p className="text-muted-foreground text-sm">
                                    User ID: {log.user_id}
                                  </p>
                                ) : log.ip_address ? (
                                  <p className="text-muted-foreground text-sm">
                                    Public submission from IP:{" "}
                                    {log.ip_address.split(",")[0]}
                                  </p>
                                ) : (
                                  <p className="text-muted-foreground text-sm">
                                    Public submission
                                  </p>
                                )}
                              </div>
                            </div>

                            <Separator />

                            <div>
                              <p className="mb-1 text-sm font-medium">Action</p>
                              <Badge
                                variant="outline"
                                className={getActionBadgeColor(log.action)}
                              >
                                {formatAction(log.action)}
                              </Badge>
                            </div>

                            {log.entity_type && (
                              <div>
                                <p className="mb-1 text-sm font-medium">
                                  Entity Type
                                </p>
                                <p>{log.entity_type}</p>
                              </div>
                            )}

                            {log.entity_id && (
                              <div>
                                <p className="mb-1 text-sm font-medium">
                                  Entity ID
                                </p>
                                <p className="font-mono text-sm">
                                  {log.entity_id}
                                </p>
                              </div>
                            )}

                            {log.old_values &&
                              Object.keys(log.old_values).length > 0 && (
                                <div>
                                  <p className="mb-1 text-sm font-medium">
                                    Previous Values
                                  </p>
                                  <pre className="bg-muted/50 max-w-[29rem] overflow-x-auto rounded-md p-2 text-xs">
                                    {JSON.stringify(log.old_values, null, 2)}
                                  </pre>
                                </div>
                              )}

                            {log.new_values &&
                              Object.keys(log.new_values).length > 0 && (
                                <div>
                                  <p className="mb-1 text-sm font-medium">
                                    New Values
                                  </p>
                                  <pre className="bg-muted/50 max-w-[29rem] overflow-auto rounded-md p-2 text-xs">
                                    {JSON.stringify(log.new_values, null, 2)}
                                  </pre>
                                </div>
                              )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && logs.length > 0 && (
          <div className="border-t py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    isActive={currentPage > 1}
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    isActive={currentPage < totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
}

export default ActivityPage;
