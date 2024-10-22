import { Length } from "class-validator";

export class UpdatePinDto {
    @Length(4, 4, {
        message: 'Pin must be 4 numbers'
    })
    pin: string;
}
