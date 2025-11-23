import mongoose, { Schema, model, models } from 'mongoose';

const CommentSchema = new Schema({
    projectId: { type: String, required: true }, // Using String to match Project._id
    name: { type: String, required: true },
    content: { type: String, required: true },
}, { timestamps: true });

// Prevent Mongoose model recompilation error in development
if (mongoose.models.Comment) {
    delete mongoose.models.Comment;
}

const Comment = models.Comment || model('Comment', CommentSchema);

export default Comment;
