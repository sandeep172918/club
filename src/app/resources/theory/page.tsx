
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Youtube } from 'lucide-react';

export default function TheoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Theory & Learning"
        description="Dive deep into concepts through curated blogs and video lectures."
      />
      
      <div className="grid gap-8 md:grid-cols-1">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <BookOpen className="h-8 w-8 text-primary" />
              Blogs & Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Read detailed tutorials, explanations, and analyses from top competitive programmers and educators.
            </p>
            {/* Placeholder for blog content */}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Youtube className="h-8 w-8 text-red-600" />
              Lectures & Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Watch video lectures that break down complex topics into easy-to-understand visual formats.
            </p>
            {/* Placeholder for video content */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
