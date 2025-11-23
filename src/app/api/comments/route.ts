import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';

export async function GET(request: Request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    try {
        const query = projectId ? { projectId: projectId } : {};
        const comments = await Comment.find(query).sort({ createdAt: -1 });
        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const comment = await Comment.create(body);
        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}
