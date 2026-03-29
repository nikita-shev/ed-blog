import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { CommentatorInfo, IComment } from '../types/comments.types';

export type CommentDocument = HydratedDocument<IComment>;
type CommentModel = Model<IComment>;

const CommentatorInfoSchema = new Schema<CommentatorInfo>({
    userId: { type: String, required: true },
    userLogin: { type: String, required: true }
});

const CommentSchema = new Schema<IComment>({
    content: { type: String, required: true },
    commentatorInfo: [CommentatorInfoSchema],
    postId: { type: String, required: true },
    createdAt: { type: String, required: true }
});

export const CommentModel = model<IComment, CommentModel>('comments', CommentSchema);
