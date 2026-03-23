import { Router } from 'express';
import { container } from '../../../composition-root';
import { checkRefreshTokenMiddleware } from '../../auth/middlewares/authorizations/check-refresh-token.middleware';
import { SecurityDevicesController } from '../controller/security-devices.controller';

export const securityDevices = Router();
const securityDevicesController = container.get(SecurityDevicesController);

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
