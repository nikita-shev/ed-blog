import { ObjectId } from 'mongodb';
import { commentCollection } from '../../../db/db.config';
import { createResultObject } from '../../../core/result-object/utils/createResultObject';
import {
    NullableResultObject,
    ResultObject,
    ResultStatus
} from '../../../core/result-object/result-object.types';
import { Comment, CommentWithId } from '../types/comments.types';
import { CommentInputDto } from '../dto/comment.dto';

//TODO: fix null -> Promise<CommentWithId | null> -> во всех местах
export const commentRepository = {
    async getCommentById(id: string): Promise<NullableResultObject<CommentWithId>> {
        const result = await commentCollection.findOne({ _id: new ObjectId(id) });

        if (!result) {
            return createResultObject(null, ResultStatus.NotFound);
        }

        return createResultObject(result);
    },

    async createComment(comment: Comment): Promise<ResultObject<string>> {
        const insertResult = await commentCollection.insertOne(comment);

        return createResultObject(insertResult.insertedId.toString());
    },

    async updateComment(id: string, content: CommentInputDto): Promise<ResultObject<boolean>> {
        const result = await commentCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: content }
        );
        const updatedComment = result.matchedCount === 1;

        return createResultObject(
            updatedComment,
            updatedComment ? ResultStatus.NoContent : ResultStatus.NotFound
        );
    },

    async deleteComment(id: string): Promise<ResultObject<boolean>> {
        const result = await commentCollection.deleteOne({ _id: new ObjectId(id) });
        const deletedComment = result.deletedCount === 1;

        return createResultObject(
            deletedComment,
            deletedComment ? ResultStatus.NoContent : ResultStatus.NotFound
        );
    }
};
