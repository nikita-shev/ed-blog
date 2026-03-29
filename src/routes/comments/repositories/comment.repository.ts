import { injectable } from 'inversify';
import { CommentDocument, CommentModel } from '../schema/schema';

@injectable()
export class CommentsRepository {
    async save(document: CommentDocument): Promise<void> {
        await document.save();
    }

    async getCommentById(id: string): Promise<CommentDocument | null> {
        return CommentModel.findOne({ _id: id });
    }

    async deleteComment(id: string): Promise<boolean> {
        const result = await CommentModel.deleteOne({ _id: id });

        return result.deletedCount === 1;
    }
}
