
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Service from '../src/models/Service';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach((line) => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

const servicesData = [
    {
        title: "Discord Bot Development",
        category: "Development",
        description: "Custom bots with advanced features, moderation tools, and API integrations tailored to your community needs.",
        price: "Starts from $50",
        icon: "Bot",
        features: [
            "Custom Slash Commands",
            "Advanced Moderation Systems",
            "Welcome & Auto-Role Systems",
            "Economy & Leveling Systems",
            "Ticket & Support Systems",
            "External API Integrations",
            "Database Integration (MongoDB)",
            "Web Dashboard Integration",
            "Payment Gateway Integration",
            "24/7 Uptime Optimization"
        ]
    },
    {
        title: "Native Android Development",
        category: "Development",
        description: "High-performance native Android applications built with Kotlin and Jetpack Compose.",
        price: "Starts from $500",
        icon: "Smartphone",
        features: [
            "Native Android (Kotlin)",
            "Modern UI with Jetpack Compose",
            "Material Design 3 Implementation",
            "Room Database (Local Storage)",
            "Retrofit/Ktor API Integration",
            "Background Services & WorkManager",
            "Google Play Services Integration",
            "Firebase Integration (Auth, Firestore)",
            "Clean Architecture & MVVM",
            "Play Store Submission Support"
        ]
    },
    {
        title: "Backend Development",
        category: "Development",
        description: "Robust and scalable backend systems using Node.js, Express, and MongoDB.",
        price: "Starts from $300",
        icon: "Server",
        features: [
            "RESTful API Design",
            "Database Design (MongoDB/SQL)",
            "Authentication & Authorization (JWT)",
            "Real-time Communication (WebSockets)",
            "Payment Processing (Stripe/PayPal)",
            "Cloud Storage Integration (AWS S3)",
            "Server Deployment & Management",
            "Docker & Containerization",
            "CI/CD Pipeline Setup",
            "API Documentation (Swagger)"
        ]
    }
];

async function seedServices() {
    try {
        let uri = MONGODB_URI!;
        if (uri.endsWith('?appName')) {
            uri = uri.replace('?appName', '');
        } else if (uri.endsWith('&appName')) {
            uri = uri.replace('&appName', '');
        }

        console.log('Connecting to MongoDB...');
        const opts = {
            bufferCommands: false,
            dbName: 'myfolio',
        };

        await mongoose.connect(uri, opts);
        console.log('Connected to MongoDB (myfolio)');

        // Clear existing services
        await Service.deleteMany({});
        console.log('Cleared existing services');

        // Insert new services
        await Service.insertMany(servicesData);
        console.log('Inserted new services data');

    } catch (error) {
        console.error('Seed failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seedServices();
