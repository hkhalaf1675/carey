import { IsOptional } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    fullName: string;

    @IsOptional()
    nickName: string;

    @IsOptional()
    address: string;

    @IsOptional()
    gender:string;
}
