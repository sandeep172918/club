
export interface Student {
  id: string;
  name: string;
  codeforcesHandle: string;
  codechefHandle: string;
  currentRating: number;
  problemsSolved: number; // New field
  totalContestsGiven: number; // New field
  ratingHistory: { contestId: string; rating: number; change: number }[];
  contestParticipation: { contestId: string; participated: boolean }[];
}

export interface Contest {
  id: string;
  name:string;
  platform: 'Codeforces' | 'CodeChef';
  date: string; // ISO date string
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  codeforcesHandle: string;
  codechefHandle: string;
  currentRating: number;
  lastContestRatingChange: number;
}

export interface AttendanceEntry {
  studentId: string;
  studentName: string;
  contestId: string;
  contestName: string;
  contestDate: string;
  platform: 'Codeforces' | 'CodeChef';
  participated: boolean;
}

export interface ProcessedContestAttendance {
  contestId: string;
  contestName: string;
  contestDate: string;
  platform: 'Codeforces' | 'CodeChef';
  attendancePercentage: number;
  studentAttendance: Record<string, boolean>; // studentId: participated
}

export interface Topic {
  id: string;
  title: string;
  description: string;
}
