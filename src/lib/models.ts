
import { z } from 'zod';

export const StudentSchema = z.object({
  name: z.string(),
  codeforcesHandle: z.string(),
  currentRating: z.number(),
  problemsSolved: z.number(),
  totalContestsGiven: z.number(),
  ratingHistory: z.array(z.object({
    contestId: z.string(),
    rating: z.number(),
    change: z.number(),
    rank: z.number(),
  })),
  secretCode: z.string(),
  // New optional fields
  gender: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  dob: z.string().optional(),
  tshirtSize: z.string().optional(),
  instituteName: z.string().optional(),
});

export const NewStudentSchema = StudentSchema.pick({
  name: true,
  codeforcesHandle: true,
  secretCode: true,
});

export const ContestSchema = z.preprocess(
  (arg) => {
    let data = arg as any;

    // Handle old 'type' field
    if (data.type && !data.platform) {
      if (['CF', 'ICPC', 'IOI'].includes(data.type)) {
        data = { ...data, platform: 'Codeforces' };
      }
    }

    // Handle Date object for 'date' field
    if (data.date instanceof Date) {
        data = { ...data, date: data.date.toISOString() };
    }

    return data;
  },
  z.object({
    id: z.number().optional(), // Make optional as it might not exist on old docs
    name: z.string(),
    platform: z.enum(['Codeforces', 'Custom']),
    date: z.string().datetime(),
    link: z.string().url().optional(),
    phase: z.string().optional(),
    durationSeconds: z.number().optional(),
    startTimeSeconds: z.number().optional(),
    frozen: z.boolean().optional(),
    type: z.string().optional(),
  }).partial() // Use partial to avoid errors on fields that might not exist on old docs
);

export const TopicSchema = z.object({
  title: z.string(),
  description: z.string(),
});
