"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Loader2, Save, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Avatar from "./avatar";
import { toast } from "sonner";

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      if ((user && user.id === null) || !user) {
        setLoading(false);
        return;
      }

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.log(error);
      toast("Error", {
        description: "Could not load profile data",
      });
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [getProfile]); // Removed unnecessary dependency: user

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null;
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
  }) {
    try {
      setUpdating(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast("Success", {
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.log(error);
      toast("Error", {
        description: "Could not update profile",
      });
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="flex h-full w-full items-start justify-start">
      <Card className="bg-background w-full max-w-2xl rounded-md border-transparent">
        <CardHeader>
          <CardTitle className="text-xl">Profile Settings</CardTitle>
          <CardDescription>
            Manage your account information and preferences
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col items-start justify-center">
            <Avatar
              uid={user?.id ?? null}
              url={avatar_url}
              size={150}
              onUpload={(url) => {
                setAvatarUrl(url);
                updateProfile({ fullname, username, website, avatar_url: url });
              }}
            />
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                value={user?.email || ""}
                disabled
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullname || ""}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={website || ""}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Button
            className="w-full cursor-pointer sm:w-auto"
            onClick={() =>
              updateProfile({ fullname, username, website, avatar_url })
            }
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

          <form
            action="/auth/signout"
            method="post"
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              type="submit"
              className="w-full cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
