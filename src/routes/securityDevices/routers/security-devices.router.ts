import { Router } from 'express';
import { checkRefreshTokenMiddleware } from '../../auth/middlewares/authorizations/check-refresh-token.middleware';
import { securityDevicesController } from '../../../composition-root';

export const securityDevices = Router();

securityDevices
    .get(
        '/devices',
        checkRefreshTokenMiddleware,
        securityDevicesController.getDevices.bind(securityDevicesController)
    )
    .delete(
        '/devices',
        checkRefreshTokenMiddleware,
        securityDevicesController.terminateAllThirdPartySessions.bind(securityDevicesController)
    )
    .delete(
        '/devices/:id',
        checkRefreshTokenMiddleware,
        securityDevicesController.terminateSpecifiedDeviceSession.bind(securityDevicesController)
    );
