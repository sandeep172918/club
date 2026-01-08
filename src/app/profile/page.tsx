

"use client";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpdateProfileDialog from "@/components/profile/update-profile-dialog";
import VerifyCodeforcesDialog from "@/components/profile/verify-codeforces-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const handleUpdateProfile = async (profile: {
    favoriteLanguage?: string;
    shirtSize?: string;
    sport?: string;
    branch?: string;
    hashKey?: string;
  }) => {
    if (user) {
      const res = await fetch(`/api/students/${(user as any)._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });
      const result = await res.json();
      
      if (result.success) {
          await refreshUser();
          toast({
            title: "Success",
            description: "Profile updated successfully!",
          });
      } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update profile",
            variant: "destructive"
          });
      }
    }
  };

  const handleVerifyCodeforces = async (handle: string) => {
    if (user) {
        const res = await fetch(`/api/students/${(user as any)._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ codeforcesHandle: handle }),
        });
        const result = await res.json();

        if (result.success) {
            await refreshUser();
            toast({
                title: "Success",
                description: "Codeforces handle verified and linked!",
            });
        } else {
            toast({
                title: "Error",
                description: result.error || "Failed to link handle",
                variant: "destructive"
            });
        }
    }
  };

  return (
    <main className="p-4 md:p-8">
      <div className="grid gap-4">
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
            <div className="flex gap-2">
                {!user?.codeforcesHandle ? (
                    <VerifyCodeforcesDialog onVerified={handleVerifyCodeforces} />
                ) : (
                    <Button variant="outline" disabled className="gap-2 cursor-default opacity-100 bg-green-50 text-green-700 border-green-200 hover:bg-green-50 hover:text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        Codeforces Verified
                    </Button>
                )}
                <UpdateProfileDialog
                    user={user}
                    onUpdateProfile={handleUpdateProfile}
                />
            </div>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
                <AvatarImage
                  src={`https://github.com/${user?.codeforcesHandle}.png`}
                  alt={`${user?.name}'s avatar`}
                />
                <AvatarFallback className="text-5xl font-bold bg-primary text-primary-foreground">
                  {user?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground">
                  {user?.name}
                </h2>
                <p className="text-md text-muted-foreground">{user?.email}</p>
                <p className="text-md text-muted-foreground">
                  Codeforces: {user?.codeforcesHandle}
                </p>
                {user?.currentRating !== undefined && (
                  <p className="text-md text-muted-foreground">
                    Current Rating: {user?.currentRating}
                  </p>
                )}
                {user?.ratingHistory && user.ratingHistory.length > 0 && (
                  <p className="text-md text-muted-foreground">
                    Last Rating Change: {user.ratingHistory[user.ratingHistory.length - 1].change}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 border-t pt-8 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex items-center">
                <span className="font-semibold w-1/2 text-muted-foreground">Favorite Language:</span>
                <span className="w-1/2 text-foreground">{user?.favoriteLanguage || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-1/2 text-muted-foreground">Shirt Size:</span>
                <span className="w-1/2 text-foreground">{user?.shirtSize || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-1/2 text-muted-foreground">Sport:</span>
                <span className="w-1/2 text-foreground">{user?.sport || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-1/2 text-muted-foreground">Branch:</span>
                <span className="w-1/2 text-foreground">{user?.branch || "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default ProfilePage;
