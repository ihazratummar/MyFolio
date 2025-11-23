
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
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

async function migrate() {
    try {
        let uri = MONGODB_URI!;
        if (uri.endsWith('?appName')) {
            uri = uri.replace('?appName', '');
        } else if (uri.endsWith('&appName')) {
            uri = uri.replace('&appName', '');
        }

        console.log('MONGODB_URI:', uri.replace(/:([^:@]+)@/, ':****@'));
        console.log('Connecting to MongoDB...');
        // Connect to the default database (which might be 'test' based on connection string)
        const conn = await mongoose.connect(uri);

        const sourceDbName = 'test';
        const targetDbName = 'myfolio';

        console.log(`Migrating from '${sourceDbName}' to '${targetDbName}'...`);

        const sourceDb = conn.connection.useDb(sourceDbName);
        const targetDb = conn.connection.useDb(targetDbName);

        if (!sourceDb.db) {
            throw new Error('Failed to get source database handle');
        }

        // Get all collections from source DB
        const collections = await sourceDb.db.listCollections().toArray();

        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            console.log(`Processing collection: ${collectionName}`);

            const sourceCollection = sourceDb.collection(collectionName);
            const targetCollection = targetDb.collection(collectionName);

            const documents = await sourceCollection.find({}).toArray();

            if (documents.length > 0) {
                // Insert documents into target collection
                // Use insertMany with ordered: false to continue if duplicates exist (though unlikely for migration)
                try {
                    await targetCollection.insertMany(documents, { ordered: false });
                    console.log(`  Copied ${documents.length} documents to '${targetDbName}.${collectionName}'`);
                } catch (e: any) {
                    if (e.code === 11000) {
                        console.log(`  Some documents already exist in '${targetDbName}.${collectionName}', skipping duplicates.`);
                    } else {
                        console.error(`  Error copying documents for ${collectionName}:`, e);
                    }
                }
            } else {
                console.log(`  No documents found in '${sourceDbName}.${collectionName}'`);
            }
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

migrate();
