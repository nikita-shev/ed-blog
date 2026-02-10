import { Router } from 'express';
import { getDevicesHandler } from './handlers/get-devices.handler';
import { checkRefreshTokenMiddleware } from '../../../auth/middlewares/authorizations/check-refresh-token.middleware';
import { terminateAllThirdPartySessionsHandler } from './handlers/terminate-all-third-party-sessions.handler';
import { terminateSpecifiedDeviceSessionHandler } from './handlers/terminate-specified-device-session.handler';

export const securityDevices = Router();

securityDevices
    .get('/devices', checkRefreshTokenMiddleware, getDevicesHandler)
    .delete('/devices', checkRefreshTokenMiddleware, terminateAllThirdPartySessionsHandler)
    .delete('/devices/:id', checkRefreshTokenMiddleware, terminateSpecifiedDeviceSessionHandler);
