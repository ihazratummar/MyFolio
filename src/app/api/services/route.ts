
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
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

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const service = await Service.create(body);
        return NextResponse.json(service);
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;
        const service = await Service.findByIdAndUpdate(_id, updateData, { new: true });
        return NextResponse.json(service);
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    await dbConnect();
    try {
        const { id } = await request.json();
        await Service.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete service' }, { status: 500 });
    }
}
