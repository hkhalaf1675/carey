export class PagnationResponseDto{
    statusCode: number;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    data: any;

    constructor(statusCode: number, totalItems: number, totalPages: number, currentPage: number, data: any){
        this.statusCode = statusCode;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.data = data;
    }
}