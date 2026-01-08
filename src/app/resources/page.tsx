
"use client";
import { TopicCard } from "@/components/resources/topic-card";
import { useEffect, useState } from "react";
import { Topic } from "@/types";
import { useAuth } from "@/context/AuthContext";
import AddResourceDialog from "@/components/resources/add-resource-dialog";

function ResourcesPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const { user } = useAuth();

  const fetchTopics = async () => {
    const res = await fetch("/api/topics");
    const { data } = await res.json();
    setTopics(data);
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleAddResource = async (resource: {
    title: string;
    description: string;
  }) => {
    await fetch("/api/topics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resource),
    });
    fetchTopics();
  };

  return (
    <main className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:truncate sm:text-4xl">
            Resources
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore topics and practice problems.
          </p>
        </div>
        {user?.role === "admin" && (
          <AddResourceDialog onAddResource={handleAddResource} />
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </main>
  );
}

export default ResourcesPage;
