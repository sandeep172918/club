import { cn } from "@/lib/utils";
import React from "react";

interface SmallBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SmallBubble({ children, className, ...props }: SmallBubbleProps) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
