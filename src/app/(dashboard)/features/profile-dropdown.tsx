"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";
import { UserResponse } from "@supabase/supabase-js";
import { ChevronUp, User2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function ProfileDropdown() {
  const client = createClient();
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [user, setUser] = useState<UserResponse["data"]["user"] | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await client.auth.getUser();
      if (error) {
        console.error(error);
        return;
      }

      setUser(data.user);
    })();
  }, [client.auth]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const { data, error } = await client
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) {
        console.error(error);
        return;
      }

      setProfile(data);
    })();
  }, [user, client]);

  console.log(profile);
  console.log(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-ful">
          <User2 /> {profile?.full_name}
          <ChevronUp className="ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">
              {profile?.full_name}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/account">Account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/auth/signout">Log out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;
