import { PageHeader } from '@/components/page-header';
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { mockLeaderboard } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LeaderboardPage() {
  // In a real app, data would be fetched here
  const leaderboardData = mockLeaderboard;

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
          <LeaderboardTable data={leaderboardData} />
        </CardContent>
      </Card>
    </div>
  );
}
