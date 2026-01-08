"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Chrome } from "lucide-react";

export default function SigninPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Login with your institute email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 py-4">
            <Button 
                variant="outline" 
                className="w-full flex items-center gap-2" 
                onClick={signInWithGoogle}
            >
                <Chrome className="h-5 w-5" />
                Sign in with Google
            </Button>
            <p className="text-xs text-center text-muted-foreground">
                Only emails ending with <strong>@iitism.ac.in</strong> are allowed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
