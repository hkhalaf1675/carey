export class FailResponseDto{
    message: string[];
    error: string;
    statusCode: number;

    constructor(message: string[], error: string, statusCode: number){
        this.message = message;
        this.error = error;
        this.statusCode = statusCode;
    }
}