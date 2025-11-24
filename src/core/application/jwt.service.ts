import jwt from 'jsonwebtoken';
import { ResultObject, ResultStatus } from '../result-object/result-object.types';
import { createResultObject } from '../result-object/utils/createResultObject';

interface Payload {
    userId: string;
}

const secretKey = process.env.SECRET_KEY as string;

export const jwtService = {
    createToken(payload: Payload): ResultObject<string> {
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        return createResultObject(token);
    },

    checkToken(token: string): ResultObject<null> | ResultObject<Payload> {
        try {
            const result = jwt.verify(token, secretKey);
            const payload: Payload = {
                userId: typeof result === 'object' ? (result.userId as string) : result // TODO fix types, how?
            };

            return createResultObject(payload);
        } catch (e) {
            return createResultObject(null, ResultStatus.BadRequest, 'Bad request', [
                { field: 'loginOrEmail', message: 'Wrong credentials' }
            ]);
        }
    }
};
