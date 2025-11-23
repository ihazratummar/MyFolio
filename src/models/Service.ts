import mongoose, { Schema, model, models } from 'mongoose';

const ServiceSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    icon: { type: String, required: true }, // Lucide icon name
    features: [{ type: String }], // List of features for the details modal
}, { timestamps: true });

const Service = models.Service || model('Service', ServiceSchema);

export default Service;
