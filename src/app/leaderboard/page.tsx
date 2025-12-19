import { PageHeader } from '@/components/page-header';
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Leaderboard"
        description="Student rankings based on their latest contest performance."
      />
      <Card>
        <CardHeader>
          <CardTitle>Overall Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <LeaderboardTable />
        </CardContent>
      </Card>
    </div>
  );
}
