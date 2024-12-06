import { IsNotEmpty, IsOptional } from "class-validator";
import { Car } from "src/database/entities/Car.entity";

export class CreateOfferDto {
    @IsNotEmpty()
    discount: string;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    carId: number;

    @IsOptional()
    car: Car;
}
