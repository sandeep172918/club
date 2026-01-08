
export interface Student {
  _id?: string;
  id: string;
  name: string;
  email: string;
  hashKey?: string;
  role: 'admin' | 'student';
  codeforcesHandle?: string;
  currentRating: number;
  favoriteLanguage?: string;
  shirtSize?: string;
  sport?: string;
  branch?: string;
  ratingHistory: { contestId: string; rating: number; change: number }[];
  contestParticipation: { contestId: string; participated: boolean }[];
}

export interface Contest {
  id: string;
  name: string;
  platform: 'Codeforces' | 'CodeChef';
  date: string; // ISO date string
}

export interface ClubContest {
  _id?: string;
  name: string;
  link: string;
  date: string; // ISO date string
  time: string;
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

declare global {
  var mongoose: {
    conn: any;
    promise: any;
  };
}
