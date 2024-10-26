import { Length } from "class-validator";

export class UpdatePinDto {
    @Length(4, 6)
    pin: string;
}
