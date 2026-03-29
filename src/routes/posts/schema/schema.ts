import { HydratedDocument, Model, Schema, model } from 'mongoose';
import { IPost } from '../types/posts.types';

export type PostDocument = HydratedDocument<IPost>;
type PostModel = Model<IPost>;

const PostSchema = new Schema<IPost>({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true }
});

export const PostModel = model<IPost, PostModel>('posts', PostSchema);
