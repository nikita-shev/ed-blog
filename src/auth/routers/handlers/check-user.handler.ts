import { Request, Response } from 'express';
import { authService } from '../../application/auth.service';
import { HttpStatus } from '../../../core/constants/http-statuses';
import { AuthInputDto } from '../../dto/auth.dto';

export async function checkUserHandler(req: Request<{}, {}, AuthInputDto>, res: Response) {
    const result = await authService.checkUser(req.body);

    if (!result) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    res.sendStatus(HttpStatus.NoContent);
}
