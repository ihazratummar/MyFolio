import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const comment = await Comment.findByIdAndDelete(params.id);
        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
    }
}
