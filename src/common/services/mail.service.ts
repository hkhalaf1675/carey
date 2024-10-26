import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService{
    constructor(
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService
    ){}

    sendMail(email: string, subject: string, message: string) {
        
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
                                ${message}
                                <p>Thank you.</p><br>
                            </div>
                        </body>
                        </html>`;
    
        this.mailerService.sendMail({
          from: this.configService.get<string>('nodemailer.user'),
          to: email,
          subject: subject,
          html: mailBody
        });
    }
}