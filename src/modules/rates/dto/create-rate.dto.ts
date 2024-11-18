import { IsNotEmpty, IsOptional, Max, Min } from "class-validator";

export class CreateRateDto {
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    rate: number;

    @IsNotEmpty()
    carId: number;

    @IsOptional()
    comment: string;
}
