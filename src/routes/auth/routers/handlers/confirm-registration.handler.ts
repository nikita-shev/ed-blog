// import { Request, Response } from 'express';
// import { authService } from '../../application/auth.service';
// import { resultCodeToHttpException } from '../../../../core/utils/result-object/utils/resultCodeToHttpException';
//
// export async function confirmRegistrationHandler(
//     req: Request<{}, {}, { code: string }>,
//     res: Response
// ) {
//     const result = await authService.confirmRegistrationUser(req.body.code);
//     const status = resultCodeToHttpException(result.status);
//
//     if (!result.data) {
//         return res.status(status).send({ errorsMessages: result.extensions });
//     }
//
//     res.sendStatus(status);
// }
