"use client";

import { useState } from "react";
import { Student } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface LogVolunteerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  clubId: string;
}

export function LogVolunteerDialog({ isOpen, onClose, student, clubId }: LogVolunteerDialogProps) {
  const { toast } = useToast();
  const [role, setRole] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !hours || !description) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student._id,
          clubId,
          role,
          description,
          hours: Number(hours),
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast({
          title: "Volunteer Hours Logged",
          description: `Successfully logged ${hours} hours for ${student.name}.`,
        });
        setRole("");
        setHours("");
        setDescription("");
        onClose();
      } else {
        toast({
          title: "Error",
          description: json.error || "Failed to log volunteer hours.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#161616] border-white/5 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Volunteer Hours</DialogTitle>
          <DialogDescription className="text-[#7A7A7A]">
            Log community service or volunteer contributions for {student.name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="vol-role" className="text-xs text-[#B5B5B5]">Volunteer Role / Title</Label>
            <Input
              id="vol-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Session Presenter, Event Volunteer"
              className="bg-[#0B0B0B] border-white/5 text-xs rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vol-hours" className="text-xs text-[#B5B5B5]">Hours Credited</Label>
            <Input
              id="vol-hours"
              type="number"
              min="0.5"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g. 2.5"
              className="bg-[#0B0B0B] border-white/5 text-xs rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vol-desc" className="text-xs text-[#B5B5B5]">Short Description of Work</Label>
            <textarea
              id="vol-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief summary of the activities performed..."
              className="w-full bg-[#0B0B0B] border border-white/5 rounded-xl text-xs p-3 focus:outline-none focus:ring-1 focus:ring-[#7EE787]"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-[#B5B5B5] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#7EE787] text-black hover:bg-[#6ed678] rounded-xl text-xs font-semibold"
            >
              {submitting ? "Logging..." : "Log Credits"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
