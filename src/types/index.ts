
export interface Student {
  id: string;
  name: string;
  codeforcesHandle: string;
  currentRating: number;
  problemsSolved: number;
  totalContestsGiven: number;
  ratingHistory: { contestId: string; rating: number; change: number }[];
  contestParticipation: { contestId: string; participated: boolean }[];
  gender?: string;
  email?: string;
  dob?: string;
  tshirtSize?: string;
  instituteName?: string;
}

export interface Contest {
  id: string;
  name:string;
  platform: 'Codeforces';
  date: string; // ISO date string
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  codeforcesHandle: string;
  currentRating: number;
  lastContestRatingChange: number;
}

export interface AttendanceEntry {
  studentId: string;
  studentName: string;
  contestId: string;
  contestName: string;
  contestDate: string;
  platform: 'Codeforces';
  participated: boolean;
}

export interface ProcessedContestAttendance {
  contestId: string;
  contestName: string;
  contestDate: string;
  platform: 'Codeforces';
  attendancePercentage: number;
  studentAttendance: Record<string, boolean>; // studentId: participated
}

export interface Topic {
  id: string;
  title: string;
  description: string;
}
