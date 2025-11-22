import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Testimonial from '@/models/Testimonial';

export async function GET() {
    await dbConnect();
    try {
        const testimonials = await Testimonial.find({});
        return NextResponse.json(testimonials);
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}
