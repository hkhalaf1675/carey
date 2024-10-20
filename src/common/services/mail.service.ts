import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService{
    constructor(
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService
    ){}

    sendMail(email: string, token: string) {
        const verificationLink = `${this.configService.get<string>('VERIFICATION_BASE_URL')}?token=${token}`;
        const mailBody = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>
                                * {
                                    font-size: 18px;
                                    margin: 5px;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <p>Hello</p><br>
                                <p>please click on this link: </p><br>
                                <a href="${verificationLink}">${verificationLink}</a><br>
                                <p>to verify your email address. </p><br>
                                <p>Thank you.</p><br>
                            </div>
                        </body>
                        </html>`;
    
        this.mailerService.sendMail({
          from: this.configService.get<string>('nodemailer.user'),
          to: email,
          subject: 'Carey: Verify Your Email',
          html: mailBody
        });
    }
}