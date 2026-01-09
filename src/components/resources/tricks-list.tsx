"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Check, Trash2, User, ShieldAlert } from "lucide-react";
import AddTrickDialog from "@/components/resources/add-trick-dialog";
import { useSocket } from "@/context/SocketContext";

interface Trick {
  _id: string;
  title: string;
  description: string;
  author: string;
  authorRole: 'admin' | 'student';
  status: 'approved' | 'pending';
}

export function TricksList() {
  const [tricks, setTricks] = useState<Trick[]>([]);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { socket } = useSocket();

  const fetchTricks = async () => {
    // If admin, fetch all (or explicitly pending + approved). If student, fetch only approved.
    // For simplicity, let's fetch all and filter client-side or we can improve API to handle permissions.
    // To match user request: "admin will have form to add problem... also give this form to students... so cards will shown to admin if he accepts request"
    
    // We will fetch all.
    const res = await fetch("/api/tricks");
    const { data } = await res.json();
    setTricks(data || []);
  };

  useEffect(() => {
    fetchTricks();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data: any) => {
        if (['TRICK_ADDED', 'TRICK_UPDATED', 'TRICK_DELETED'].includes(data.type)) {
            fetchTricks();
        }
    };
    socket.on("data_update", handleUpdate);
    return () => {
        socket.off("data_update", handleUpdate);
    };
  }, [socket]);

  const handleApprove = async (id: string) => {
    await fetch(`/api/tricks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    socket?.emit('data_update', { type: 'TRICK_UPDATED' });
    fetchTricks();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tricks/${id}`, {
      method: "DELETE",
    });
    socket?.emit('data_update', { type: 'TRICK_DELETED' });
    fetchTricks();
  };

  const displayedTricks = tricks.filter(trick => {
    if (isAdmin) return true; // Admins see everything
    return trick.status === 'approved'; // Students only see approved
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
         <AddTrickDialog onAddTrick={fetchTricks} />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayedTricks.map((trick) => (
          <Card key={trick._id} className={`relative flex flex-col ${trick.status === 'pending' ? 'border-dashed border-yellow-500 bg-yellow-50/10' : ''}`}>
             {/* Admin Badge */}
            {trick.authorRole === 'admin' && (
              <Badge variant="secondary" className="absolute top-2 right-2 text-xs px-1.5 py-0.5 h-5 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                Admin
              </Badge>
            )}
             {/* Pending Badge (Only visible to admin technically due to filter) */}
             {trick.status === 'pending' && isAdmin && (
               <Badge variant="outline" className="absolute top-2 left-2 text-xs px-1.5 py-0.5 h-5 border-yellow-500 text-yellow-500">
                 Pending Request
               </Badge>
             )}

            <CardHeader className="pb-2">
              <CardTitle className="text-lg pr-12">{trick.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground break-words">
                {trick.description}
              </p>
            </CardContent>
            <CardFooter className="pt-2 flex flex-col gap-2 items-start border-t bg-muted/20">
               <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-[150px]">{trick.author}</span>
               </div>
               
               {isAdmin && trick.status === 'pending' && (
                   <div className="flex w-full gap-2 mt-2">
                       <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 h-8" onClick={() => handleApprove(trick._id)}>
                           <Check className="h-4 w-4 mr-1" /> Approve
                       </Button>
                        <Button size="sm" variant="destructive" className="w-full h-8" onClick={() => handleDelete(trick._id)}>
                           <Trash2 className="h-4 w-4 mr-1" /> Reject
                       </Button>
                   </div>
               )}
                {/* Admin can delete any trick */}
                {isAdmin && trick.status === 'approved' && (
                    <div className="flex w-full justify-end mt-2">
                         <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(trick._id)}>
                           <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                )}
            </CardFooter>
          </Card>
        ))}
        {displayedTricks.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-10">
                No tricks found. Be the first to add one!
            </div>
        )}
      </div>
    </div>
  );
}