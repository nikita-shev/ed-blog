import { Request, Response } from 'express';
import { OutputDto } from '../../core/types/dto.types';
import { BlogOutputDto } from '../dto';
import { BasicSearchParams } from '../../core/types/search-params.types';

export interface BlogsSearchParams extends BasicSearchParams {
    searchNameTerm: string;
}

export type RequestQuery = Request<{}, {}, {}, BlogsSearchParams>;
export type ResponseBody = Response<OutputDto<BlogOutputDto>>;
