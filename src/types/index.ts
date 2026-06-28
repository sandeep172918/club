
export interface Student {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'coordinator' | 'member' | 'student';
  codeforcesHandle?: string;
  currentRating: number;
  favoriteLanguage?: string;
  shirtSize?: string;
  sport?: string;
  branch?: string;
  graduatingYear?: number;
  points: number;
  solvedPOTDs?: string[];
  solvedResources?: string[];
  ratingHistory: { contestId: string; rating: number; change: number; contestName?: string; timestamp?: string }[];
  contestParticipation: { contestId: string; participated: boolean }[];
  clubId?: string;
  clubJoinStatus?: 'Pending' | 'Approved' | 'Rejected' | 'None';
  clubs?: { clubId: any; status: 'Pending' | 'Approved' | 'Rejected' | 'None' }[];
  requestedRole?: 'member' | 'coordinator';
  roleRequestStatus?: 'Pending' | 'Approved' | 'Rejected' | 'None';
  lastSyncedCodeforces?: string;
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

export interface Club {
  _id?: string;
  name: string;
  slug: string;
  type: 'official' | 'fan';
  description?: string;
  coordinators: string[]; // User IDs
  logo?: string;
  bannerColor?: string;
  isActive?: boolean;
  requestedCoordinatorEmail?: string;
  createdAt?: string;
}

export interface VolunteerLog {
  _id?: string;
  studentId: string;
  studentName: string;
  clubId: string;
  role: string;
  description: string;
  hours: number;
  date: string;
}

declare global {
  var mongoose: {
    conn: any;
    promise: any;
  };
}
