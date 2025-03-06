import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAuditLogs,
  getSubmissionsStatusChange, // Changed from getSubmissionCountsByStatus
} from "@/utils/services/data-service";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FiArrowUp, FiArrowDown } from "react-icons/fi"; // Added FiArrowDown
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const statusCounts = await getSubmissionsStatusChange(); // Using the new function
  const recentAuditLogs = await getAuditLogs(5);

  return (
    <div className="container mx-auto max-w-11/12 space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of submissions and recent activity.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Submissions by Status</h2>
          {statusCounts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-muted-foreground py-6 text-center">
                  <p>No status data available.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {statusCounts.map((status) => (
                <Link
                  key={status.id}
                  href={`/dashboard/submissions?status=${status.id}`}
                  className="block transition-opacity hover:opacity-90"
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardDescription className="capitalize">
                        {status.name.replace("-", " ")}
                      </CardDescription>
                      <CardTitle className="text-2xl">{status.count}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-sm">
                          {status.percentChange !== 0 && (
                            <span
                              className={
                                status.increased
                                  ? "text-emerald-600"
                                  : "text-red-600"
                              }
                            >
                              {status.increased ? (
                                <FiArrowUp className="h-4 w-4" />
                              ) : (
                                <FiArrowDown className="h-4 w-4" />
                              )}
                            </span>
                          )}
                          <span
                            className={
                              status.increased
                                ? "text-emerald-600"
                                : "text-red-600"
                            }
                          >
                            {status.percentChange !== 0
                              ? `${Math.abs(status.percentChange)}%`
                              : "0%"}
                          </span>
                          <span className="text-muted-foreground">
                            from last month
                          </span>
                        </div>
                        <ArrowUpRight className="text-muted-foreground h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Recent Admin Actions</h2>
          <Card>
            {recentAuditLogs.length === 0 ? (
              <CardContent className="pt-6">
                <div className="text-muted-foreground py-6 text-center">
                  No recent admin actions found.
                </div>
              </CardContent>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-medium">Admin</th>
                      <th className="px-4 py-3 text-left font-medium">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/50 border-b">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={log.profiles?.avatar_url || ""}
                                alt={log.profiles?.full_name || ""}
                              />
                              <AvatarFallback>
                                {(log.profiles?.full_name ||
                                  "User")[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {log.profiles?.full_name || "Unknown User"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{log.action}</td>
                        <td className="text-muted-foreground px-4 py-3">
                          {formatDistanceToNow(new Date(log.timestamp), {
                            addSuffix: true,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {recentAuditLogs.length > 0 && (
                  <div className="px-4 py-3 text-center">
                    <Link
                      href="/dashboard/activity"
                      className="text-primary text-sm underline-offset-4 hover:underline"
                    >
                      View all activity
                    </Link>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
