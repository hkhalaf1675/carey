export class SuccessResponseDto{
    message: string;
    data: any;
    statusCode: number;

    constructor(message: string, data: any, statusCode: number){
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }
}