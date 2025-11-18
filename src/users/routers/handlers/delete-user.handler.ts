import { Request, Response } from 'express';
import { usersService } from '../../application/users.service';
import { HttpStatus } from '../../../core/constants/http-statuses';

export async function deleteUserHandler(req: Request<{ id: string }>, res: Response) {
    const result = await usersService.deleteUser(req.params.id);

    if (!result) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    res.sendStatus(HttpStatus.NoContent);
}
