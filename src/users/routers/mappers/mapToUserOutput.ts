import { OutputDto, SearchResult } from '../../../core/types/dto.types';
import { UserWithId } from '../../types/users.types';
import { UserOutputDto } from '../../dto/users.dto';
import { UsersSearchParams } from '../../types/transaction.types';

type ParamsType = Pick<UsersSearchParams, 'pageSize' | 'pageNumber'>;

export function convertUserData(user: UserWithId): UserOutputDto {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    };
}

// TODO: duplicate, move to 'core'
export function mapToUserOutput(
    data: SearchResult<UserWithId>,
    params: ParamsType
): OutputDto<UserOutputDto> {
    const { items, totalCount } = data;
    const { pageNumber: page, pageSize } = params;
    const users = items.map(convertUserData);

    return {
        pagesCount: Math.ceil(totalCount / pageSize),
        page,
        pageSize,
        totalCount,
        items: users
    };
}
