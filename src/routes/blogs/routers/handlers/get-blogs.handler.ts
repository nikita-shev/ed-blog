import { blogsService } from '../../application/blogs.service';
import { mapToBlogOutput } from '../mappers/mapToBlogOutput';
import { HttpStatus } from '../../../../core/constants/http-statuses';
import { BlogsSearchParams, RequestQuery, ResponseBody } from '../../types/transaction.types';
import { matchedData } from 'express-validator';

export async function getBlogsHandler(req: RequestQuery, res: ResponseBody) {
    const sanitizedQuery = matchedData<BlogsSearchParams>(req, {
        locations: ['query'],
        includeOptionals: true
    });

    const data = await blogsService.getBlogs(sanitizedQuery);
    const result = mapToBlogOutput(data, {
        pageSize: sanitizedQuery.pageSize,
        pageNumber: sanitizedQuery.pageNumber
    });

    res.status(HttpStatus.Success).send(result);
}
