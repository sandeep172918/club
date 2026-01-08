"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Student } from "@/types";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: Student | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  signin: (email: string, hashKey: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const refreshUser = async () => {
    // Logic to refresh user... simplified for now, mainly used after profile updates
    // If logged in via Google, we use the current Firebase user.
    // If logged in via manual (hash), we might need to store the ID in local storage or rely on session if we had one.
    // Since we don't have a persistent session for manual login beyond this state (unless we add it),
    // this refresh might only work fully for Google auth or if we persist manual auth.
    // For now, let's just re-fetch if we have a user in state.
    if (user && user._id) {
         try {
            const res = await fetch(`/api/students/${user._id}`);
            const { success, data } = await res.json();
            if (success) {
                setUser(data);
            }
        } catch (error) {
            console.error("Error refreshing user:", error);
        }
    }
  };

  // Sync Firebase auth state with our backend user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!firebaseUser.email?.endsWith("@iitism.ac.in")) {
            await firebaseSignOut(auth);
            setUser(null);
            setLoading(false);
            toast({
                title: "Access Denied",
                description: "Only @iitism.ac.in emails are allowed.",
                variant: "destructive"
            });
            return;
        }

        // Sync with backend
        try {
            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                }),
            });
            const { success, data } = await res.json();
            if (success) {
                setUser(data);
                toast({
                    title: "Signed In",
                    description: `Welcome back, ${data.name}!`,
                });
                router.push("/");
            } else {
                console.error("Backend sync failed");
                setUser(null);
                 toast({
                    title: "Error",
                    description: "Failed to sync with backend.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Error syncing user:", error);
            setUser(null);
        }
      } else {
        // Only set user to null if we are NOT manually logged in (checked via some other persistent state if we had it)
        // For this simple implementation, we'll assume Firebase handles the "main" session.
        // If manual login happens, it sets 'user' state directly.
        // We need to be careful not to wipe manual login state when Firebase initializes as null.
        if (!user) { 
             setLoading(false); 
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // user dependency removed to avoid loops, but be careful with manual login persistence

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (!user.email?.endsWith("@iitism.ac.in")) {
        await firebaseSignOut(auth);
        toast({
            title: "Access Denied",
            description: "Only @iitism.ac.in emails are allowed.",
            variant: "destructive"
        });
        return;
      }
      // The useEffect will handle the backend sync and redirect
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      toast({
            title: "Sign In Failed",
            description: error.message || "Failed to sign in with Google.",
            variant: "destructive"
        });
    }
  };

  const signout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    router.push("/signin");
    toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
    });
  };

  const signin = async (email: string, hashKey: string) => {
    try {
        const res = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, hashKey }),
        });
    
        const { success, data, message } = await res.json();
    
        if (success) {
          setUser(data);
          toast({
            title: "Signed In",
            description: `Welcome back, ${data.name}!`,
          });
          router.push('/');
        } else {
          toast({
            title: "Sign In Failed",
            description: message || 'Invalid credentials',
            variant: "destructive"
          });
        }
    } catch (error) {
        toast({
            title: "Error",
            description: "An unexpected error occurred.",
            variant: "destructive"
        });
    }
  };

  const signup = async (userData: any) => {
    console.warn("Manual signup is deprecated/admin-only via dashboard.");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signout, refreshUser, signin, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}