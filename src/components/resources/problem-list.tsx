"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, ExternalLink, User, Check, Trash2, Info, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/SocketContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Problem {
  _id: string;
  title?: string;
  link: string;
  rating: number;
  topic: string;
  kind: 'Standard' | 'Tricky' | 'Decomposer';
  description?: string;
  contributor?: string;
  authorRole?: 'admin' | 'student';
  status?: 'approved' | 'pending';
}

interface ProblemListProps {
  problems: Problem[];
  onUpdate?: () => void;
}

export function ProblemList({ problems, onUpdate }: ProblemListProps) {
  const { user, refreshUser } = useAuth();
  const { socket } = useSocket();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data: any) => {
        if (['PROBLEM_ADDED', 'PROBLEM_UPDATED', 'PROBLEM_DELETED'].includes(data.type)) {
            onUpdate?.();
        }
    };
    socket.on("data_update", handleUpdate);
    return () => {
        socket.off("data_update", handleUpdate);
    };
  }, [socket, onUpdate]);

  // Filter problems: Admins see all, Students see only approved
  const visibleProblems = problems.filter(p => isAdmin || p.status === 'approved' || !p.status);

  // Group problems by topic
  const groupedByTopic = visibleProblems.reduce((acc, problem) => {
    if (!acc[problem.topic]) {
      acc[problem.topic] = { Standard: [], Tricky: [], Decomposer: [] };
    }
    acc[problem.topic][problem.kind].push(problem);
    return acc;
  }, {} as Record<string, Record<string, Problem[]>>);

  const topics = Object.keys(groupedByTopic).sort();

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <TopicAccordion
          key={topic}
          topic={topic}
          categories={groupedByTopic[topic]}
          isAdmin={isAdmin}
          onUpdate={onUpdate}
          user={user}
          refreshUser={refreshUser}
        />
      ))}
      {topics.length === 0 && (
        <div className="text-center text-muted-foreground py-10">
          No problems added yet.
        </div>
      )}
    </div>
  );
}

function TopicAccordion({
  topic,
  categories,
  isAdmin,
  onUpdate,
  user,
  refreshUser
}: {
  topic: string;
  categories: Record<string, Problem[]>;
  isAdmin: boolean;
  onUpdate?: () => void;
  user: any;
  refreshUser: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [solvingIds, setSolvingIds] = useState<Set<string>>(new Set());
  const { socket } = useSocket();

  const handleApprove = async (id: string) => {
    await fetch(`/api/problems/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
    });
    socket?.emit('data_update', { type: 'PROBLEM_UPDATED' });
    if (onUpdate) onUpdate();
  };

  const handleDelete = async (id: string) => {
      await fetch(`/api/problems/${id}`, {
          method: "DELETE",
      });
      socket?.emit('data_update', { type: 'PROBLEM_DELETED' });
      if (onUpdate) onUpdate();
  };

  const handleToggleSolve = async (problemId: string) => {
    if (!user?._id) return;
    setSolvingIds(prev => new Set(prev).add(problemId));
    try {
        await fetch(`/api/students/${user._id}/solve`, {
            method: 'POST',
            body: JSON.stringify({ problemId })
        });
        await refreshUser();
    } catch (e) {
        console.error(e);
    } finally {
        setSolvingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(problemId);
            return newSet;
        });
    }
  };


  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-card hover:bg-accent/50 transition-colors text-left"
      >
        <span className="text-lg font-semibold">{topic}</span>
        {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>
      {isOpen && (
        <div className="bg-background p-4 space-y-4 border-t">
          {(["Standard", "Tricky", "Decomposer"] as const).map((kind) => {
             const kindProblems = categories[kind];
             if (kindProblems.length === 0) return null;
             return (
               <div key={kind} className="space-y-2">
                 <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                   {kind}
                 </h4>
                 <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                   {kindProblems.map((problem) => {
                     const isSolved = user?.solvedResources?.includes(problem._id);
                     const isSolving = solvingIds.has(problem._id);

                     return (
                     <Card 
                        key={problem._id} 
                        className={`hover:bg-accent/50 transition-colors flex flex-col ${problem.status === 'pending' ? 'border-dashed border-yellow-500 bg-yellow-50/10' : ''}`}
                     >
                       <CardContent className="p-3 flex-grow">
                         <div className="flex justify-between items-start gap-2">
                            <div className="flex flex-col gap-1 min-w-0">
                                <a
                                    href={problem.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium hover:underline truncate flex items-center gap-2"
                                >
                                    {problem.title || "Problem Link"}
                                    <ExternalLink className="h-3 w-3 opacity-50" />
                                </a>
                                <div className="flex flex-wrap gap-2 items-center">
                                    <Badge variant="outline" className="w-fit text-xs">
                                        Rating: {problem.rating}
                                    </Badge>
                                    {problem.authorRole === 'admin' && (
                                        <Badge variant="secondary" className="text-[10px] h-5 px-1 bg-primary/10 text-primary">Admin</Badge>
                                    )}
                                     {problem.status === 'pending' && isAdmin && (
                                        <Badge variant="outline" className="text-[10px] h-5 px-1 border-yellow-500 text-yellow-500">Pending</Badge>
                                    )}
                                </div>
                            </div>
                            
                            {/* Info Tooltip for Description */}
                            {problem.description && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs text-sm">
                                            <p>{problem.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                         </div>
                       </CardContent>
                       
                       <CardFooter className="p-3 pt-0 flex flex-col gap-2 border-t bg-muted/20 text-xs text-muted-foreground">
                            <div className="flex justify-between w-full items-center pt-2">
                                <div className="flex items-center gap-1 truncate max-w-[120px]">
                                    <User className="h-3 w-3" />
                                    <span className="truncate">{problem.contributor || "Anonymous"}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                     <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-6 px-2 text-xs ${isSolved ? 'text-green-600' : 'text-muted-foreground'}`}
                                        onClick={() => handleToggleSolve(problem._id)}
                                        disabled={isSolving}
                                    >
                                        {isSolving ? <Loader2 className="h-3 w-3 animate-spin" /> : 
                                          isSolved ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />
                                        }
                                        {isSolved ? "Solved" : "Solve"}
                                    </Button>

                                    {isAdmin && problem.status !== 'pending' && (
                                        <button onClick={() => handleDelete(problem._id)} className="text-destructive hover:text-destructive/80 p-1">
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                           
                            {/* Admin Actions for Pending */}
                            {isAdmin && problem.status === 'pending' && (
                                <div className="flex w-full gap-2 mt-1">
                                    <Button size="sm" className="w-full h-7 text-xs bg-green-600 hover:bg-green-700" onClick={() => handleApprove(problem._id)}>
                                        <Check className="h-3 w-3 mr-1" /> Approve
                                    </Button>
                                    <Button size="sm" variant="destructive" className="w-full h-7 text-xs" onClick={() => handleDelete(problem._id)}>
                                        <Trash2 className="h-3 w-3 mr-1" /> Reject
                                    </Button>
                                </div>
                            )}
                       </CardFooter>
                     </Card>
                   )})}
                 </div>
               </div>
             );
          })}
        </div>
      )}
    </div>
  );
}