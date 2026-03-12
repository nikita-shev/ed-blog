import { Request, Response } from 'express';
import { BasicSearchParams } from '../../../core/types/search-params.types';
import { OutputDto } from '../../../core/types/dto.types';
import { PostOutputDto } from '../dto';

export interface PostsSearchParams extends BasicSearchParams {}

export type RequestQuery = Request<{}, {}, {}, PostsSearchParams>;
export type ResponseBody = Response<OutputDto<PostOutputDto>>;
