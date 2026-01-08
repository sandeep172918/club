"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MessageCircleQuestion,
  Mail,
  Instagram,
  Linkedin,
  Twitter,
  Code,
} from "lucide-react";
import Link from "next/link";

export default function SupportBubble() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="h-14 w-14 rounded-full shadow-lg"
            size="icon"
          >
            <MessageCircleQuestion className="h-8 w-8" />
            <span className="sr-only">Need Support?</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end" side="top">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Need Help?</h4>
              <p className="text-sm text-muted-foreground">
                If you are facing any problems, please contact the admin.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="flex flex-col space-y-1">
                <span className="font-semibold text-sm">Admin: Sandeep Kumar</span>
                <Link
                  href="mailto:cp.cpp.club@gmail.com"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  cp.cpp.club@gmail.com
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
               <span className="text-xs text-muted-foreground">Connect with me:</span>
               <div className="flex gap-2">
                  <Link href="https://www.instagram.com/sandeep172918/" target="_blank" className="text-muted-foreground hover:text-pink-600 transition-colors">
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                  <Link href="https://www.linkedin.com/in/sandeep172918/" target="_blank" className="text-muted-foreground hover:text-blue-600 transition-colors">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                   <Link href="https://x.com/sandeep172918" target="_blank" className="text-muted-foreground hover:text-sky-500 transition-colors">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                   <Link href="https://codeforces.com/profile/sandeep172918/" target="_blank" className="text-muted-foreground hover:text-yellow-600 transition-colors">
                    <Code className="h-5 w-5" />
                    <span className="sr-only">Codeforces</span>
                  </Link>
               </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
