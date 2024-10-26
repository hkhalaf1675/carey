import { IsNotEmpty } from "class-validator";

export class PasswodrDto {
    @IsNotEmpty()
    password: string;
}
