"use client";

import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Megaphone, Trash2, Edit2, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSocket } from "@/context/SocketContext";
import { Badge } from "@/components/ui/badge";

interface Notification {
  _id: string;
  message: string;
  type: 'info' | 'warning' | 'urgent';
  createdAt: string;
}

export function NotificationPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const { socket } = useSocket();
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Notification | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Form state
  const [message, setMessage] = useState("");
  const [type, setType] = useState<'info' | 'warning' | 'urgent'>("info");

  const isAdmin = user?.role === "admin" || (user?.email === 'cp.cpp.club@gmail.com');

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data: any) => {
        if (data.type === 'NOTIFICATION_UPDATE') {
            fetchNotifications();
        }
    };
    socket.on("data_update", handleUpdate);
    return () => {
        socket.off("data_update", handleUpdate);
    };
  }, [socket]);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    try {
      const url = editItem ? `/api/notifications/${editItem._id}` : "/api/notifications";
      const method = editItem ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, type, createdBy: user?.name }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: editItem ? "Notification updated" : "Notification posted" });
        setIsAdminOpen(false);
        setEditItem(null);
        setMessage("");
        setType("info");
        fetchNotifications();
        socket?.emit('data_update', { type: 'NOTIFICATION_UPDATE' });
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Operation failed", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notification?")) return;
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Deleted", description: "Notification removed" });
        fetchNotifications();
        socket?.emit('data_update', { type: 'NOTIFICATION_UPDATE' });
      }
    } catch (error) {
       toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  const openEdit = (notif: Notification) => {
    setEditItem(notif);
    setMessage(notif.message);
    setType(notif.type);
    setIsAdminOpen(true);
  };

  const openAdd = () => {
    setEditItem(null);
    setMessage("");
    setType("info");
    setIsAdminOpen(true);
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200';
      default: return 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold leading-none flex items-center gap-2">
            <Megaphone className="h-4 w-4" /> Notifications
          </h4>
          {isAdmin && (
             <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={openAdd}>
                        <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editItem ? 'Edit Notification' : 'Broadcast Notification'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Textarea 
                                placeholder="Type your message here (max 500 chars)..." 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                maxLength={500}
                                className="h-32"
                            />
                            <div className="text-xs text-right text-muted-foreground">{message.length}/500</div>
                        </div>
                        <div className="grid gap-2">
                            <Select value={type} onValueChange={(v: any) => setType(v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="info">Info (Blue)</SelectItem>
                                    <SelectItem value="warning">Warning (Yellow)</SelectItem>
                                    <SelectItem value="urgent">Urgent (Red)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSubmit}>Broadcast</Button>
                    </DialogFooter>
                </DialogContent>
             </Dialog>
          )}
        </div>
        <ScrollArea className="h-[300px]">
            {notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                    No notifications yet.
                </div>
            ) : (
                <div className="flex flex-col gap-2 p-4">
                    {notifications.map((notif) => (
                        <div key={notif._id} className={`p-3 rounded-lg border text-sm relative group ${getTypeColor(notif.type)}`}>
                            <p className="pr-6 whitespace-pre-wrap break-words">{notif.message}</p>
                            <span className="text-xs opacity-70 mt-2 block">
                                {new Date(notif.createdAt).toLocaleDateString()}
                            </span>
                            {isAdmin && (
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 rounded p-0.5">
                                    <button onClick={() => openEdit(notif)} className="p-1 hover:text-blue-600">
                                        <Edit2 className="h-3 w-3" />
                                    </button>
                                    <button onClick={() => handleDelete(notif._id)} className="p-1 hover:text-red-600">
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
