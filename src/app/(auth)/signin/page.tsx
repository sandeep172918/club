"use client";

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
import { useAuth } from "@/context/AuthContext";
import { Chrome } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SigninPage() {
  const { signInWithGoogle, signin } = useAuth();
  const [email, setEmail] = useState("");
  const [hashKey, setHashKey] = useState("");

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signin(email, hashKey);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Choose your preferred login method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="google" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="google">Institute Email</TabsTrigger>
              <TabsTrigger value="hash">Hash Key</TabsTrigger>
            </TabsList>

            <TabsContent value="google">
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
            </TabsContent>

            <TabsContent value="hash">
              <form onSubmit={handleManualSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hashKey">Hash Key</Label>
                  <Input
                    id="hashKey"
                    type="password"
                    placeholder="Enter your secret key"
                    required
                    value={hashKey}
                    onChange={(e) => setHashKey(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
