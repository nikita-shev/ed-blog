import { BlogInputDto } from '../../../src/blogs/dto';

// Authorization
export const authorizationData = 'Basic YWRtaW46cXdlcnR5';

// Common
export const incorrectId = '11ee';

// Blogs
export const dataForUpdatingBlog: BlogInputDto = {
    name: 'Blog 2',
    description: 'blog description 2',
    websiteUrl: 'https://www.micro.net'
};
export const incorrectBlog = {
    name: 'CupCupCupCupCupCupCupCupCupCupCupCupCupCup',
    // description: 123,
    websiteUrl: 'htt://cupm'
};
