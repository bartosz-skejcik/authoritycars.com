"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Tables } from "@/types/database.types";
import { useState } from "react";
import { Plus } from "lucide-react";
import {
  createAccount,
  type AccountInsert,
} from "@/utils/services/data-service";
import { toast } from "sonner";
import AccountCard from "./account-card";

type Props = {
  accounts: Tables<"profiles">[];
};

function AccountManagement({ accounts }: Props) {
  const [localAccounts, setLocalAccounts] =
    useState<Tables<"profiles">[]>(accounts);
  const [isCreating, setIsCreating] = useState(false);
  const [newAccount, setNewAccount] = useState<AccountInsert>({
    full_name: "",
    email: "",
    password: "",
  });

  const handleCreateAccount = async () => {
    // This function was referenced but not implemented in the original code
    // Placeholder for the actual implementation
    const { data, error } = await createAccount(newAccount);

    if (error) {
      console.error(error);
      setIsCreating(false);
      toast.error("Failed to create account");
      return;
    }

    if (data) {
      toast.success("Account created successfully");

      setLocalAccounts([...localAccounts, data]);

      navigator.clipboard.writeText(
        `email: ${newAccount.email}\npassword: ${newAccount.password}`,
      );

      toast.info("Email and password copied to clipboard!");
    } else {
      console.error("handleCreateAccount", data, error);
      toast.error("Failed to create account");
    }

    setIsCreating(false);
    setNewAccount({
      full_name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Accounts Management</CardTitle>
              <CardDescription>
                Create, edit, and delete admin accounts.
              </CardDescription>
            </div>
            {!isCreating && (
              <Button onClick={() => setIsCreating(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isCreating && (
            <div className="mb-6 rounded-lg border p-4">
              <h3 className="mb-4 text-lg font-medium">Create New Account</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-account-fullname">Full name</Label>
                  <Input
                    id="new-account-fullname"
                    value={newAccount.full_name}
                    type="text"
                    onChange={(e) =>
                      setNewAccount((prev) => {
                        return { ...prev, full_name: e.target.value };
                      })
                    }
                    placeholder="Enter user's full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-account-email">Email</Label>
                  <Input
                    id="new-account-email"
                    value={newAccount.email}
                    type="email"
                    onChange={(e) =>
                      setNewAccount((prev) => {
                        return { ...prev, email: e.target.value };
                      })
                    }
                    placeholder="Enter user's email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-account-password">Password</Label>
                  <Input
                    id="new-account-password"
                    value={newAccount.password}
                    type="text"
                    onChange={(e) =>
                      setNewAccount((prev) => {
                        return { ...prev, password: e.target.value };
                      })
                    }
                    placeholder="Enter user's password"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAccount}>Create Account</Button>
                </div>
              </div>
            </div>
          )}

          {localAccounts.length === 0 ? (
            <div className="text-muted-foreground py-6 text-center">
              No accounts found. Create an account to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {localAccounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AccountManagement;
