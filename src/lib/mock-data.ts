
import type { Student, Contest, LeaderboardEntry, AttendanceEntry, Topic } from '@/types';

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Wonderland',
    codeforcesHandle: 'alice_cf',
    codechefHandle: 'alice_cc',
    currentRating: 1850,
    problemsSolved: 250,
    totalContestsGiven: 15,
    ratingHistory: [
      { contestId: 'cf1', rating: 1700, change: 100 },
      { contestId: 'cc1', rating: 1780, change: 80 },
      { contestId: 'cf2', rating: 1850, change: 70 },
    ],
    contestParticipation: [
      { contestId: 'cf1', participated: true },
      { contestId: 'cc1', participated: true },
      { contestId: 'cf2', participated: true },
      { contestId: 'cc2', participated: false },
    ],
  },
  {
    id: '2',
    name: 'Bob The Builder',
    codeforcesHandle: 'bob_cf',
    codechefHandle: 'bob_cc',
    currentRating: 1620,
    problemsSolved: 180,
    totalContestsGiven: 12,
    ratingHistory: [
      { contestId: 'cf1', rating: 1500, change: 50 },
      { contestId: 'cc1', rating: 1550, change: 50 },
      { contestId: 'cf2', rating: 1620, change: 70 },
    ],
    contestParticipation: [
      { contestId: 'cf1', participated: true },
      { contestId: 'cc1', participated: false },
      { contestId: 'cf2', participated: true },
      { contestId: 'cc2', participated: true },
    ],
  },
  {
    id: '3',
    name: 'Charlie Brown',
    codeforcesHandle: 'charlie_cf',
    codechefHandle: 'charlie_cc',
    currentRating: 2010,
    problemsSolved: 350,
    totalContestsGiven: 20,
    ratingHistory: [
      { contestId: 'cf1', rating: 1900, change: 80 },
      { contestId: 'cc1', rating: 1950, change: 50 },
      { contestId: 'cf2', rating: 2010, change: 60 },
    ],
    contestParticipation: [
      { contestId: 'cf1', participated: true },
      { contestId: 'cc1', participated: true },
      { contestId: 'cf2', participated: true },
      { contestId: 'cc2', participated: true },
    ],
  },
];

export const mockContests: Contest[] = [
  { id: 'cf1', name: 'Codeforces Round #900 (Div. 2)', platform: 'Codeforces', date: '2024-07-15T18:00:00Z' },
  { id: 'cc1', name: 'CodeChef Starters 150', platform: 'CodeChef', date: '2024-07-18T14:30:00Z' },
  { id: 'cf2', name: 'Codeforces Educational Round #160', platform: 'Codeforces', date: '2024-07-22T17:00:00Z' },
  { id: 'cc2', name: 'CodeChef Lunchtime July', platform: 'CodeChef', date: '2024-07-25T12:00:00Z' },
];

export const mockLeaderboard: LeaderboardEntry[] = mockStudents
  .sort((a, b) => b.currentRating - a.currentRating)
  .map((student, index) => ({
    rank: index + 1,
    studentId: student.id,
    name: student.name,
    codeforcesHandle: student.codeforcesHandle,
    codechefHandle: student.codechefHandle,
    currentRating: student.currentRating,
    lastContestRatingChange: student.ratingHistory[student.ratingHistory.length - 1]?.change || 0,
  }));

export const mockAttendance: AttendanceEntry[] = [];
mockStudents.forEach(student => {
  mockContests.forEach(contest => {
    const participation = student.contestParticipation.find(p => p.contestId === contest.id);
    mockAttendance.push({
      studentId: student.id,
      studentName: student.name,
      contestId: contest.id,
      contestName: contest.name,
      contestDate: contest.date,
      platform: contest.platform,
      participated: participation ? participation.participated : false,
    });
  });
});

export const mockOverallRatingTrend = [
  { date: '2024-06-01', averageRating: 1600 },
  { date: '2024-06-15', averageRating: 1650 },
  { date: '2024-07-01', averageRating: 1700 },
  { date: '2024-07-15', averageRating: 1780 },
  { date: '2024-07-22', averageRating: 1820 },
];

export const mockRecentContestParticipation = [
  { contestName: 'CF Round #900', participation: 28, nonParticipation: 2 },
  { contestName: 'CC Starters 150', participation: 25, nonParticipation: 5 },
  { contestName: 'CF Edu #160', participation: 30, nonParticipation: 0 },
  { contestName: 'CC Lunchtime July', participation: 22, nonParticipation: 8 },
];

export const mockUpcomingContests: Contest[] = [
  {
    id: 'ucf1',
    name: 'Codeforces Global Round 27',
    platform: 'Codeforces',
    // Set date to 7 days from now
    date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
  },
  {
    id: 'ucc1',
    name: 'CodeChef Starters 155 (Rated for All)',
    platform: 'CodeChef',
    // Set date to 10 days from now
    date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
  },
  {
    id: 'ucf2',
    name: 'Educational Codeforces Round 170',
    platform: 'Codeforces',
    // Set date to 14 days from now
    date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
  },
  {
    id: 'ucc2',
    name: 'CodeChef Lunchtime August',
    platform: 'CodeChef',
     // Set date to 20 days from now
    date: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(),
  }
];

export const mockTopics: Topic[] = [
  {
    id: 'where-to-start',
    title: 'Where to Start',
    description: 'Begin your competitive programming journey here. Learn the basics of a programming language, data structures, and algorithmic thinking.',
  },
  {
    id: 'data-structures',
    title: 'Data Structures',
    description: 'Master fundamental data structures like Arrays, Strings, Stacks, Queues, Linked Lists, Trees, and Graphs. They are the building blocks of efficient solutions.',
  },
  {
    id: 'sorting-searching',
    title: 'Sorting & Searching',
    description: 'Learn various sorting algorithms (like Merge Sort, Quick Sort) and searching techniques (like Binary Search) to efficiently process data.',
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    description: 'Understand the concept of DP to solve complex problems by breaking them down into simpler, overlapping subproblems.',
  },
  {
    id: 'graph-theory',
    title: 'Graph Theory',
    description: 'Explore graph traversal (BFS, DFS), shortest path algorithms (Dijkstra, Bellman-Ford), and minimum spanning trees (Prim, Kruskal).',
  },
  {
    id: 'number-theory',
    title: 'Number Theory',
    description: 'Dive into prime numbers, modular arithmetic, GCD, and other mathematical concepts frequently seen in competitive programming.',
  },
];
