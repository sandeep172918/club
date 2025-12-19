
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { z } from 'zod';

const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE;

const CustomContestSchema = z.object({
    name: z.string().min(3, "Contest name must be at least 3 characters long."),
    date: z.string().datetime("Invalid date and time format."),
    link: z.string().url("Invalid contest link URL."),
});


export async function POST(req: Request) {
    if (!ADMIN_SECRET_CODE) {
        console.error("ADMIN_SECRET_CODE is not set in environment variables.");
        return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { adminCode, ...contestData } = body;

        if (adminCode !== ADMIN_SECRET_CODE) {
            return NextResponse.json({ message: 'Unauthorized. Invalid admin code.' }, { status: 401 });
        }

        const validation = CustomContestSchema.safeParse(contestData);

        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid input.', errors: validation.error.issues }, { status: 400 });
        }
        
        const { name, date, link } = validation.data;
        const startTimeSeconds = Math.floor(new Date(date).getTime() / 1000);

        const newContest = {
            id: Math.floor(Math.random() * 1000000) + 10000, // Generate a random ID
            name,
            platform: 'Custom',
            phase: new Date(date) > new Date() ? 'BEFORE' : 'FINISHED',
            frozen: false,
            durationSeconds: 0, // Not applicable for custom contests
            startTimeSeconds,
            date,
            link, // Custom field
        };

        const { db } = await connectToDatabase();
        await db.collection('contests').insertOne(newContest);

        return NextResponse.json({ message: 'Contest added successfully.', contest: newContest }, { status: 201 });

    } catch (error) {
        console.error('Error adding custom contest:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
