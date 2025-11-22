import mongoose, { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    category: { type: String, required: true },
    image: { type: String, required: true },
    liveUrl: { type: String },
    githubUrl: { type: String },
}, { timestamps: true });

const Project = models.Project || model('Project', ProjectSchema);

export default Project;
