import mongoose, { Schema, model, models } from 'mongoose';

const ServiceSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    icon: { type: String, required: true }, // Store icon name
    tiers: [{
        name: { type: String, required: true },
        price: { type: String, required: true },
        description: { type: String, required: true },
        features: [{ type: String }],
        popular: { type: Boolean, default: false },
        color: { type: String },
        bg: { type: String },
        border: { type: String },
    }]
}, { timestamps: true });

const Service = models.Service || model('Service', ServiceSchema);

export default Service;
