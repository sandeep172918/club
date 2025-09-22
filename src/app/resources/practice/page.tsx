
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

export default function PracticePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Practice Problems"
        description="Select a difficulty to start solving problems."
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-green-500" />
              Easy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Fundamental problems to build a strong base. Perfect for beginners.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-yellow-500" />
              Medium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Challenging problems that require solid data structures and algorithms knowledge.
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-red-500" />
              Hard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Complex problems that will test the limits of your problem-solving skills.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-purple-500" />
              Tourist-level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Extremely difficult problems, often requiring advanced or obscure techniques.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
