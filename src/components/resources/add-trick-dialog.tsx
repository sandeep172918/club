
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

interface AddTrickDialogProps {
  onAddTrick: () => void;
}

export default function AddTrickDialog({
  onAddTrick,
}: AddTrickDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { socket } = useSocket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const role = user?.role || 'student';
        const status = role === 'admin' ? 'approved' : 'pending';

        await fetch("/api/tricks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                description,
                author: user?.name || user?.email || "Anonymous",
                authorRole: role,
                status
            })
        });
        socket?.emit('data_update', { type: 'TRICK_ADDED' });
        onAddTrick();
        setIsOpen(false);
        setTitle("");
        setDescription("");
    } catch (error) {
        console.error("Failed to add trick", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Trick</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share a CP Trick</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Topic</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" required placeholder="e.g. Fast I/O" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Details</Label>
            <div className="col-span-3">
                <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                    maxLength={200}
                    placeholder="Max 200 characters"
                    className="resize-none h-24"
                />
                <div className="text-xs text-muted-foreground text-right mt-1">
                    {description.length}/200
                </div>
            </div>
          </div>
          <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
