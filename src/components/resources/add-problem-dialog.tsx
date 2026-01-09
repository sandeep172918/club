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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { CP_TOPICS } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

interface AddProblemDialogProps {
  onAddProblem: () => void;
}

export default function AddProblemDialog({
  onAddProblem,
}: AddProblemDialogProps) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [rating, setRating] = useState("");
  const [topic, setTopic] = useState("");
  const [kind, setKind] = useState("Standard");
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
        
        let contributor = user?.name || user?.email?.split('@')[0] || "Anonymous";
        if (role === 'admin') {
            contributor = "Admin";
        }

        await fetch("/api/problems", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                link,
                rating: parseInt(rating),
                topic,
                kind,
                description,
                contributor,
                authorRole: role,
                status
            })
        });
        
        socket?.emit('data_update', { type: 'PROBLEM_ADDED' });
        
        onAddProblem();
        setIsOpen(false);
        // Reset form
        setTitle("");
        setLink("");
        setRating("");
        setTopic("");
        setKind("Standard");
        setDescription("");
    } catch (error) {
        console.error("Failed to add problem", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Problem</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a new problem</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" placeholder="Problem Name (Optional)" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link" className="text-right">Link</Label>
            <Input id="link" value={link} onChange={(e) => setLink(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rating" className="text-right">Rating</Label>
            <Input id="rating" type="number" value={rating} onChange={(e) => setRating(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="topic" className="text-right">Topic</Label>
            <div className="col-span-3">
                <Select onValueChange={setTopic} required>
                <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                    {CP_TOPICS.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="kind" className="text-right">Kind</Label>
             <div className="col-span-3">
                <Select onValueChange={setKind} defaultValue={kind}>
                <SelectTrigger>
                    <SelectValue placeholder="Select kind" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Tricky">Tricky</SelectItem>
                    <SelectItem value="Decomposer">Decomposer</SelectItem>
                </SelectContent>
                </Select>
            </div>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Why?</Label>
            <div className="col-span-3">
                <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    maxLength={200}
                    placeholder="Briefly explain the beauty (Optional, max 200 chars)"
                    className="resize-none h-20"
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