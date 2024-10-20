import { IsEmail, IsNotEmpty, IsOptional, Length } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    fullName: string;

    @IsOptional()
    nickName: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Length(8, 50)
    @IsNotEmpty()
    password: string;

    @IsNotEmpty({
        message: 'Please Select Role'
    })
    roleId: number;
}
