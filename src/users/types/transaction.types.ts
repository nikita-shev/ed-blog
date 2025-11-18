import { Request, Response } from 'express';
import { OutputDto } from '../../core/types/dto.types';
import { UserOutputDto } from '../dto/users.dto';
import { BasicSearchParams } from '../../core/types/search-params.types';

export interface UsersSearchParams extends BasicSearchParams {
    searchLoginTerm: string;
    searchEmailTerm: string;
}

export type RequestQuery = Request<{}, {}, {}, UsersSearchParams>;
export type ResponseBody = Response<OutputDto<UserOutputDto>>;
