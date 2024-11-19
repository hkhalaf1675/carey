import { IsNotEmpty, IsOptional } from "class-validator";
import { Brand } from "src/database/entities/Brand.entity";
import { User } from "src/database/entities/User.entity";

export class CreateCarDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    status: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    type?: string;

    @IsNotEmpty()
    brandId: number;

    @IsOptional()
    brand?: Brand

    @IsOptional()
    user?: User
}
