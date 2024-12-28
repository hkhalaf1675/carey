import { IsEnum, IsNotEmpty } from "class-validator";

export class CreateRateReactDto {
    @IsNotEmpty()
    @IsEnum({
        like: 'like',
        love: 'love',
        wow: 'wow',
        sad: 'sad',
        angery: 'angery'
    })
    react: string;

    @IsNotEmpty()
    rateId: number;
}
