import { IsNotEmpty } from "class-validator";

export class CreateWishlistDto {
    @IsNotEmpty()
    carId: number;
}
