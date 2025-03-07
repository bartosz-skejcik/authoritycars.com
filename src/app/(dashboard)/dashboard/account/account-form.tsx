"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  Loader2,
  Save,
  LogOut,
  User as UserIcon,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";

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
import Avatar from "./avatar";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { redirect } from "next/navigation";

type ProfileFormValues = {
  fullname: string;
  username: string;
  website: string;
};

type PasswordFormValues = {
  current_password: string;
  new_password: string;
  new_password_repeated: string;
};

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  // Profile Form
  const profileForm = useForm<ProfileFormValues>({
    defaultValues: {
      fullname: "",
      username: "",
      website: "",
    },
  });

  // Password Form
  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_repeated: "",
    },
  });

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      if (!user || user.id === null) {
        setLoading(false);
        return;
      }

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        profileForm.reset({
          fullname: data.full_name || "",
          username: data.username || "",
          website: data.website || "",
        });
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error(error);
      toast("Error", {
        description: "Could not load profile data",
      });
    } finally {
      setLoading(false);
    }
  }, [user, supabase, profileForm]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  async function updateProfile(data: ProfileFormValues) {
    try {
      setUpdating(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        full_name: data.fullname,
        username: data.username,
        website: data.website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast("Success", {
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.error(error);
      toast("Error", {
        description: "Could not update profile",
      });
    } finally {
      setUpdating(false);
    }
  }

  async function changePassword(data: PasswordFormValues) {
    try {
      setChangingPassword(true);

      if (data.new_password !== data.new_password_repeated) {
        toast("Error", {
          description: "New passwords do not match",
        });
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: data.new_password,
      });

      if (error) throw error;

      // Reset the form
      passwordForm.reset();

      toast("Success", {
        description: "Your password has been changed successfully",
      });
    } catch (error) {
      console.error(error);
      toast("Error", {
        description:
          "Failed to change password. Please check your current password and try again.",
      });
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <div className="container mx-auto max-w-11/12 space-y-8 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Profile Card */}
        <Card className="bg-card w-full rounded-lg border shadow-sm transition-all hover:shadow-md">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center gap-2">
              <UserIcon className="text-primary h-5 w-5" />
              <CardTitle className="text-2xl font-bold">
                Profile Settings
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Manage your personal information
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex justify-start">
              <Avatar
                uid={user?.id ?? null}
                url={avatar_url}
                size={128}
                onUpload={(url) => {
                  setAvatarUrl(url);
                  updateProfile(profileForm.getValues());
                }}
              />
            </div>

            <form
              onSubmit={profileForm.handleSubmit(updateProfile)}
              className="space-y-4"
            >
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="text"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="fullname" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="fullname"
                  type="text"
                  placeholder="Enter your full name"
                  disabled={loading}
                  {...profileForm.register("fullname")}
                  className="focus:ring-primary/20 transition-all focus:ring-2"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  disabled={loading}
                  {...profileForm.register("username")}
                  className="focus:ring-primary/20 transition-all focus:ring-2"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="website" className="text-sm font-medium">
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  disabled={loading}
                  {...profileForm.register("website")}
                  className="focus:ring-primary/20 transition-all focus:ring-2"
                />
              </div>

              <Button
                type="submit"
                className="w-full transition-all hover:shadow-md"
                disabled={loading || updating}
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>

              <Button
                variant="destructive"
                onClick={() => redirect("/auth/signout")}
                type="button"
                className="w-full cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Card */}
        <Card className="bg-card w-full rounded-lg border shadow-sm transition-all hover:shadow-md">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center gap-2">
              <Lock className="text-primary h-5 w-5" />
              <CardTitle className="text-2xl font-bold">
                Change Password
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form
              onSubmit={passwordForm.handleSubmit(changePassword)}
              className="space-y-4"
            >
              <div className="space-y-1">
                <Label
                  htmlFor="current_password"
                  className="text-sm font-medium"
                >
                  Current Password
                </Label>
                <Input
                  id="current_password"
                  type="password"
                  placeholder="Enter current password"
                  {...passwordForm.register("current_password", {
                    required: "Current password is required",
                  })}
                  className="focus:ring-primary/20 transition-all focus:ring-2"
                />
                {passwordForm.formState.errors.current_password && (
                  <p className="mt-1 text-sm text-red-500">
                    {passwordForm.formState.errors.current_password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="new_password" className="text-sm font-medium">
                  New Password
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Input
                          id="new_password"
                          type="password"
                          placeholder="Enter new password"
                          {...passwordForm.register("new_password", {
                            required: "New password is required",
                            minLength: {
                              value: 8,
                              message: "Password must be at least 8 characters",
                            },
                          })}
                          className="focus:ring-primary/20 transition-all focus:ring-2"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Password should be at least 8 characters</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {passwordForm.formState.errors.new_password && (
                  <p className="mt-1 text-sm text-red-500">
                    {passwordForm.formState.errors.new_password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="new_password_repeated"
                  className="text-sm font-medium"
                >
                  Confirm New Password
                </Label>
                <Input
                  id="new_password_repeated"
                  type="password"
                  placeholder="Confirm new password"
                  {...passwordForm.register("new_password_repeated", {
                    required: "Please confirm your new password",
                    validate: (value) =>
                      value === passwordForm.getValues("new_password") ||
                      "Passwords do not match",
                  })}
                  className="focus:ring-primary/20 transition-all focus:ring-2"
                />
                {passwordForm.formState.errors.new_password_repeated && (
                  <p className="mt-1 text-sm text-red-500">
                    {
                      passwordForm.formState.errors.new_password_repeated
                        .message
                    }
                  </p>
                )}
              </div>

              <Alert className="border-amber-600 bg-amber-500/20 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-amber-600">
                  For security reasons, you&apos;ll be logged out after changing
                  your password.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full transition-all hover:shadow-md"
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
