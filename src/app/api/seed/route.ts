import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import Social from '@/models/Social';
import Service from '@/models/Service';
import Testimonial from '@/models/Testimonial';
import { projects, socialLinks, services, reviews } from '@/data/portfolio';

export async function GET() {
    await dbConnect();
    try {
        // Clear existing data
        await Project.deleteMany({});
        await Social.deleteMany({});
        await Service.deleteMany({});
        await Testimonial.deleteMany({});

        // Seed new data
        await Project.insertMany(projects);

        const formattedSocials = socialLinks.map((link: any) => ({
            ...link,
            icon: link.icon?.displayName || link.name
        }));
        await Social.insertMany(formattedSocials);

        // Transform services data to match schema
        const formattedServices = services.map((s: any) => ({
            ...s,
            icon: s.icon?.displayName || 'Globe',
            tiers: [] // Populate tiers if needed
        }));
        await Service.insertMany(formattedServices);

        await Testimonial.insertMany(reviews);

        return NextResponse.json({ success: true, message: 'Database seeded successfully!' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
