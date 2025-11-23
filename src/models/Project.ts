import mongoose, { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
    id: { type: Number, required: true }, // Display Order
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    category: { type: String, required: true },
    images: [{ type: String }],
    image: { type: String }, // Deprecated: used for backward compatibility
    liveUrl: { type: String },
    githubUrl: { type: String },
}, { timestamps: true });

// Prevent Mongoose model recompilation error in development
if (mongoose.models.Project) {
    delete mongoose.models.Project;
}

const Project = models.Project || model('Project', ProjectSchema);

export default Project;
