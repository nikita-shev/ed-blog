import { ObjectId } from 'mongodb';
import { commentCollection } from '../../../db/db.config';
import { ResultStatus } from '../../../core/utils/result-object/types/result-object.types';
import { Comment, CommentWithId } from '../types/comments.types';
import { CommentInputDto } from '../dto/comment.dto';

//TODO: fix null -> Promise<CommentWithId | null> -> во всех местах
export class CommentRepository {
    async getCommentById(id: string): Promise<CommentWithId | null> {
        return await commentCollection.findOne({ _id: new ObjectId(id) });

        // const result = await commentCollection.findOne({ _id: new ObjectId(id) });

        // if (!result) {
        //     return createResultObject(null, ResultStatus.NotFound);
        // }
        //
        // return createResultObject(result);
    }

    async createComment(comment: Comment): Promise<string> {
        const insertResult = await commentCollection.insertOne(comment);

        // return createResultObject(insertResult.insertedId.toString());
        return insertResult.insertedId.toString();
    }

    async updateComment(id: string, content: CommentInputDto): Promise<boolean> {
        const result = await commentCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: content }
        );

        // return createResultObject(result.matchedCount === 1, ResultStatus.NoContent);
        return result.matchedCount === 1;
    }

    async deleteComment(id: string): Promise<boolean> {
        const result = await commentCollection.deleteOne({ _id: new ObjectId(id) });

        // return createResultObject(result.deletedCount === 1, ResultStatus.NoContent);
        return result.deletedCount === 1;
    }
}
