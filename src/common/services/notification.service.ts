import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Twilio  from "twilio";

@Injectable()
export class NotificationService{
    private client: Twilio.Twilio;
    constructor(
        private readonly configService: ConfigService
    ){
        const accountSid = configService.get<string>('twilio.accountSid');
        const authToken = configService.get<string>('twilio.authToken');

        this.client = Twilio(accountSid, authToken);
    }

    async sendSms(to: string, message: string){
        const twilioPhone = this.configService.get<string>('twilio.phoneNumber');
        await this.client.messages.create({
            from: twilioPhone,
            to: `${to}`,
            body: message
        });
    }

    async sendWhatsappMessage(to: string, message: string){
        const twilioPhone = this.configService.get<string>('twilio.phoneNumber');
        await this.client.messages.create({
            from: `whatsapp:${twilioPhone}`,
            to: `whatsapp:${to}`,
            body: message
        });
    }
}