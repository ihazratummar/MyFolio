import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Social from '@/models/Social';

export async function GET() {
    await dbConnect();
    try {
        const socials = await Social.find({});
        return NextResponse.json(socials);
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch socials' }, { status: 500 });
    }
}
