import { WithId } from 'mongodb';

export interface Blog {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
}
export type IBlog = Blog; // TODO: временно

export type BlogWithId = WithId<Blog>;

// TODO: как лучше: Blog или IBlog?
