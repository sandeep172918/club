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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface AddPOTDDialogProps {
  onAddPOTD: (potd: any) => void;
}

export default function AddPOTDDialog({ onAddPOTD }: AddPOTDDialogProps) {
  const [problemName, setProblemName] = useState("");
  const [link, setLink] = useState("");
  const [points, setPoints] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemName || !link || !points || !endTime) {
        toast({ title: "Error", description: "All fields are required", variant: "destructive" });
        return;
    }

    onAddPOTD({
        problemName,
        link,
        points: Number(points),
        endTime: new Date(endTime).toISOString()
    });
    setIsOpen(false);
    // Reset form
    setProblemName("");
    setLink("");
    setPoints("");
    setEndTime("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add POTD
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Problem of the Day</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Problem Name</Label>
            <Input id="name" value={problemName} onChange={(e) => setProblemName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link" className="text-right">Link (CF)</Label>
            <Input id="link" value={link} onChange={(e) => setLink(e.target.value)} className="col-span-3" placeholder="https://codeforces.com/contest/..."/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="points" className="text-right">Points</Label>
            <Input id="points" type="number" value={points} onChange={(e) => setPoints(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right">End Time</Label>
            <Input id="endTime" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="col-span-3" />
          </div>
          <Button type="submit">Create POTD</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
