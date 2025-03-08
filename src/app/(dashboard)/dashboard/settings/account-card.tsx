import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Calendar } from "lucide-react";
import type { Tables } from "@/types/database.types";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  account: Tables<"profiles">;
};

function AccountCard({ account }: Props) {
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);

  const getInitials = (fullName: string | null) => {
    if (!fullName) return "AD";

    return fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  async function handleDeleteAccount() {
    const response = await fetch(`/api/accounts?id=${account.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      // get the text of the response
      const errorMessage = await response.text();
      toast.error(`Failed to delete account: ${errorMessage}`);
      return;
    }

    toast.success("Account deleted successfully");

    window.location.reload();
  }

  // Format the updated_at date if available
  const formatDate = (date: string | null) => {
    if (!date) return "Never updated";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      if (!account.avatar_url) return;

      return supabase.storage
        .from("avatars")
        .download(account.avatar_url)
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }

          const url = URL.createObjectURL(data);

          setProfileAvatar(url);
        });
    })();
  }, [account.avatar_url]);

  return (
    <Card key={account.id} className="overflow-hidden py-0">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-4 border-b p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={profileAvatar || undefined}
                alt={account.full_name || "Admin"}
              />
              <AvatarFallback>{getInitials(account.full_name)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              {account.full_name && (
                <h3 className="font-semibold">{account.full_name}</h3>
              )}
              {account.username && (
                <p className="text-muted-foreground text-sm">
                  @{account.username}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-2 p-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="text-muted-foreground h-4 w-4" />
              <span>ID: {account.id}</span>
            </div>
            {account.username && (
              <div className="flex items-center gap-2">
                <Mail className="text-muted-foreground h-4 w-4" />
                <span>{account.username}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span>{formatDate(account.updated_at)}</span>
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <Button
                onClick={handleDeleteAccount}
                variant="destructive"
                size="default"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AccountCard;
