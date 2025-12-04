import nodemailer from 'nodemailer';
import { createResultObject } from '../core/result-object/utils/createResultObject';
import { ResultObject, ResultStatus } from '../core/result-object/result-object.types';

export const emailAdapter = {
    async sendEmail(
        email: string,
        subject: string,
        message: string
    ): Promise<ResultObject<boolean>> {
        try {
            const transporter = nodemailer.createTransport({
                // service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    type: 'OAuth2',
                    user: process.env.SMTP_HOST,
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                    accessToken: process.env.OAUTH_ACCESS_TOKEN
                },
                logger: true
            });

            // await transporter.verify(); // Проверка подключения

            await transporter.sendMail({
                from: `blogs.com <${process.env.SMTP_HOST}>`, // sender address
                to: email, //email,
                subject,
                html: message
            });

            return createResultObject(true);
        } catch (e) {
            return createResultObject(false, ResultStatus.BadRequest); // TODO: добавить текст ошибки
        }
    }
};

// TODO:move, rename
export function createMessage(code: string): string {
    return `<div> 
                <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                    <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
                </p>
            </div>`;
}
