import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';

export async function GET() {
    await dbConnect();
    try {
        const services = await Service.find({});
        return NextResponse.json(services);
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
    }
}
