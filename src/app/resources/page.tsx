"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AddProblemDialog from "@/components/resources/add-problem-dialog";
import { ProblemList } from "@/components/resources/problem-list";
import { TricksList } from "@/components/resources/tricks-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function ResourcesPage() {
  const [problems, setProblems] = useState([]);
  const { user } = useAuth();
  
  const fetchProblems = async () => {
    const res = await fetch("/api/problems");
    const { data } = await res.json();
    setProblems(data || []);
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  return (
    <main className="p-4 md:p-8 container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:truncate sm:text-4xl">
            Resources
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Curated problems and competitive programming tricks.
          </p>
        </div>
        {/* Both Admin and Students can add problems now (students via request) */}
         <AddProblemDialog onAddProblem={fetchProblems} />
      </div>

      <Tabs defaultValue="problems" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="problems">Problem Page</TabsTrigger>
          <TabsTrigger value="tricks">CP Tricks</TabsTrigger>
        </TabsList>
        <TabsContent value="problems">
          <ProblemList problems={problems} onUpdate={fetchProblems} />
        </TabsContent>
        <TabsContent value="tricks">
          <TricksList />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default ResourcesPage;