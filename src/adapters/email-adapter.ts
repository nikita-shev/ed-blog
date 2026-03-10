import nodemailer from 'nodemailer';
import { badRequestResult, successResult } from '../core/utils/result-object';
import { ServiceDto } from '../core/utils/result-object/types/result-object.types';

// sendEmail_Not_Work - первая версия на gmail(ban)
export const emailAdapter = {
    async sendEmail_Not_Work(
        email: string,
        subject: string,
        message: string
    ): Promise<ServiceDto<boolean>> {
        try {
            let accessToken;
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
                    // accessToken: accessToken || process.env.OAUTH_ACCESS_TOKEN
                },
                logger: true
            });

            // transporter.set('oauth2_provision_cb', (user, renew, cb) => {
            //     console.log(user);
            //
            //     // const token = userTokens[user];
            //     // if (!token) return cb(new Error('Unknown user'));
            //     // cb(null, token);
            // });
            // transporter.on('token', (t) => {
            //     accessToken = t.accessToken;
            // });

            // await transporter.verify(); // Проверка подключения

            await transporter.sendMail({
                from: `blogs.com <${process.env.SMTP_HOST}>`, // sender address
                to: email, //email,
                subject,
                html: message
            });

            // return createResultObject(true);
            return successResult.create(true);
        } catch (e) {
            // console.log(e);

            // return createResultObject(false, ResultStatus.BadRequest); // TODO: добавить текст ошибки
            return badRequestResult.create(false, 'Bad Request'); // TODO: добавить текст ошибки
        }
    },

    async sendEmail(email: string, subject: string, message: string): Promise<ServiceDto<boolean>> {
        try {
            // 1. Создаем тестовую учетку (автоматически)
            let testAccount = await nodemailer.createTestAccount();

            // 2. Настраиваем транспорт
            let transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false, // true для 465, false для других портов
                auth: {
                    user: testAccount.user, // сгенерированный логин
                    pass: testAccount.pass // сгенерированный пароль
                }
            });

            // 3. Отправляем письмо
            let info = await transporter.sendMail({
                from: `"Blogs Support" <${testAccount.user}>`, // sender address
                to: email,
                subject,
                text: 'Please confirm your registration by following the link: https://somesite.com',
                html: message
            });

            console.log('Письмо отправлено!');
            // 4. Ссылка на просмотр письма в браузере
            console.log('Посмотреть здесь: %s', nodemailer.getTestMessageUrl(info));

            // return createResultObject(true);
            return successResult.create(true);
        } catch (e) {
            console.log(e);
            // return createResultObject(false, ResultStatus.BadRequest); // TODO: добавить текст ошибки
            return badRequestResult.create(false, 'Bad Request'); // TODO: добавить текст ошибки
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
