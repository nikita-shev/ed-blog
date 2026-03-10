import jwt from 'jsonwebtoken';
import { successResult, unauthorizedResult } from '../utils/result-object';
import { ServiceDto } from '../utils/result-object/types/result-object.types';

interface Payload {
    userId: string;
    deviceId?: string; // TODO: fix
}

const secretKey = process.env.SECRET_KEY as string;

export const jwtService = {
    createToken(payload: Payload, options: jwt.SignOptions): ServiceDto<string> {
        const token = jwt.sign(payload, secretKey, options);

        // return createResultObject(token);
        return successResult.create(token);
    },

    checkToken(token: string): ServiceDto<null> | ServiceDto<Payload> {
        try {
            const result = jwt.verify(token, secretKey);
            const payload: Payload = {
                userId: typeof result === 'object' ? (result.userId as string) : result // TODO fix types, how?
            };

            // return createResultObject(payload);
            return successResult.create(payload);
        } catch (e) {
            // return createResultObject(null, ResultStatus.Unauthorized);
            return unauthorizedResult.create();
            // return createResultObject(null, ResultStatus.BadRequest, 'Bad request', [
            //     { field: 'loginOrEmail', message: 'Wrong credentials' }
            // ]);
        }
    },

    // TODO: fix type
    decode<T>(token: string): ServiceDto<T> {
        const payload = jwt.decode(token);

        // return createResultObject(payload as T);
        return successResult.create(payload as T);
    }
};
