import { IsNotEmpty } from "class-validator";

export class UpdatePhoneDto {
    @IsNotEmpty()
    phone: string;
}
