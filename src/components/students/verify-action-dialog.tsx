"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VerifyActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (secretCode: string) => Promise<void>;
  title: string;
  description: string;
}

export function VerifyActionDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: VerifyActionDialogProps) {
  const [secretCode, setSecretCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(secretCode);
    } finally {
      setIsSubmitting(false);
      setSecretCode("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="secret-code">Secret Code</Label>
            <Input
              id="secret-code"
              type="password"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              placeholder="Enter the student's secret code"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || secretCode.length < 6}
          >
            {isSubmitting ? "Verifying..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
