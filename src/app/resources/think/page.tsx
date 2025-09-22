
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

export default function ThinkPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Think & Memorize"
        description="Train your problem-solving intuition with memory exercises."
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="text-primary" />
            Memory Card Game
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A memory card game to help associate problem types with their corresponding data structures or algorithms is coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
