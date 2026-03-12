export interface PostInputDto {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}

export type PostInputWithoutBlogIdDto = Omit<PostInputDto, 'blogId'>;
