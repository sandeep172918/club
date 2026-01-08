
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Target, BrainCircuit, Lightbulb, SortAsc, Binary, Hash, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Topic } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';


interface TopicCardProps {
  topic: Topic;
}

const iconMap: Record<string, LucideIcon> = {
  'where-to-start': Lightbulb,
  'data-structures': BrainCircuit,
  'sorting-searching': SortAsc,
  'dynamic-programming': Target,
  'graph-theory': Binary,
  'number-theory': Hash,
};

export function TopicCard({ topic }: TopicCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = iconMap[topic.id] || BrainCircuit;

  return (
    <Card 
      className="w-full transition-all duration-300 ease-in-out"
    >
      <div className="flex items-center">
        {/* Main clickable area */}
        <div className="flex-grow p-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center gap-4">
            <Icon className="h-7 w-7 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">{topic.title}</h3>
              <p className="text-sm text-muted-foreground">{topic.description}</p>
            </div>
          </div>
        </div>
        
        {/* Animated panel on the right */}
        <div 
          className={cn(
            "flex items-center justify-center gap-3 pr-6 transition-all duration-300 ease-in-out overflow-hidden",
            isOpen ? "w-[360px] opacity-100" : "w-0 opacity-0"
          )}
        >
          <Button variant="outline" size="sm" asChild>
            <Link href={`/resources/theory?topic=${topic.id}`}>
              <BookOpen className="mr-2 h-4 w-4" />
              Theory
            </Link>
          </Button>

          {topic.id !== 'where-to-start' && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/resources/practice?topic=${topic.id}`}>
                  <Target className="mr-2 h-4 w-4" />
                  Practice
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/resources/think?topic=${topic.id}`}>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Think
                </Link>
              </Button>
            </>
          )}

        </div>

        {/* Chevron Icon as a visual indicator */}
        <div className="p-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
           <ChevronRight className={cn("h-5 w-5 text-muted-foreground transition-transform duration-300", isOpen && "rotate-90")} />
        </div>
      </div>
    </Card>
  );
}
