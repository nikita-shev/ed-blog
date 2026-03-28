import { HydratedDocument, Model, model, Schema } from 'mongoose';
import { IBlog } from '../types/blog.types';

const BlogSchema = new Schema<IBlog>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true }
});

type BlogModel = Model<IBlog>;
export type BlogDocument = HydratedDocument<IBlog>;

export const BlogModel = model<IBlog, BlogModel>('blogs', BlogSchema);

// TODO: добавить обработку ошибок, когда на сервер отправляют неправильные данные.
