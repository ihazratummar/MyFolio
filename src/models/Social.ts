import mongoose, { Schema, model, models } from 'mongoose';

const SocialSchema = new Schema({
    name: { type: String, required: true },
    href: { type: String, required: true },
    icon: { type: String, required: true }, // Store icon name (e.g., "Github", "Linkedin")
    color: { type: String },
}, { timestamps: true });

const Social = models.Social || model('Social', SocialSchema);

export default Social;
