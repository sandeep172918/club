import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import POTD from '@/models/POTD';
import Student from '@/models/Student';
import fetch from 'node-fetch';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { potdId, userId, codeforcesHandle } = await req.json();

    if (!potdId || !userId || !codeforcesHandle) {
        return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const potd = await POTD.findById(potdId);
    if (!potd) {
        return NextResponse.json({ success: false, error: "POTD not found" }, { status: 404 });
    }

    // Check if expired
    if (new Date() > new Date(potd.endTime)) {
        return NextResponse.json({ success: false, error: "POTD has expired" }, { status: 400 });
    }

    // Check if already solved
    const student = await Student.findById(userId);
    if (student.solvedPOTDs && student.solvedPOTDs.includes(potdId)) {
        return NextResponse.json({ success: false, error: "Already solved this POTD" }, { status: 400 });
    }

    // Extract Contest ID and Index from Link
    // Supported formats: 
    // https://codeforces.com/contest/1234/problem/A
    // https://codeforces.com/problemset/problem/1234/A
    let contestId, index;
    const link = potd.link;
    
    const contestMatch = link.match(/contest\/(\d+)\/problem\/(\w+)/);
    const problemsetMatch = link.match(/problemset\/problem\/(\d+)\/(\w+)/);

    if (contestMatch) {
        contestId = contestMatch[1];
        index = contestMatch[2];
    } else if (problemsetMatch) {
        contestId = problemsetMatch[1];
        index = problemsetMatch[2];
    } else {
         return NextResponse.json({ success: false, error: "Invalid Codeforces Link format in POTD" }, { status: 400 });
    }

    // Fetch user submissions
    const cfResponse = await fetch(`https://codeforces.com/api/user.status?handle=${codeforcesHandle}&from=1&count=10`);
    const cfData = await cfResponse.json() as any;

    if (cfData.status !== "OK") {
        return NextResponse.json({ success: false, error: "Failed to fetch Codeforces submissions" }, { status: 500 });
    }

    // Check for "OK" submission to the specific problem
    const solved = cfData.result.some((sub: any) => {
        return (
            sub.contestId == contestId &&
            sub.problem.index == index &&
            sub.verdict === "OK"
        );
    });

    if (solved) {
        // Update Student
        student.points = (student.points || 0) + potd.points;
        student.solvedPOTDs = student.solvedPOTDs || [];
        student.solvedPOTDs.push(potdId);
        await student.save();

        // Update POTD
        potd.solvedBy.push(userId);
        await potd.save();

        return NextResponse.json({ success: true, points: potd.points });
    } else {
        return NextResponse.json({ success: false, error: "No accepted submission found for this problem." }, { status: 400 });
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
