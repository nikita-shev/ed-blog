import { Request, Response } from 'express';
import { BasicSearchParams } from '../../../core/types/search-params.types';
import { OutputDto } from '../../../core/types/dto.types';
import { CommentOutputDto } from '../dto/comment.dto';

export interface CommentsSearchParams extends BasicSearchParams {}

export type RequestQuery = Request<{}, {}, {}, CommentsSearchParams>;
export type ResponseBody = Response<OutputDto<CommentOutputDto>>;
