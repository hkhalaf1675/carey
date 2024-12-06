import dataSource from "src/database/data-source";
import { PagnationResponseDto } from "../dto/pagnation.response.dto";
import { InternalServerErrorException } from "@nestjs/common";
import { FailResponseDto } from "../dto/fail.response.dto";

export const pagnationService = async (Entity: any, query: any, options: any) => {
    const page = options.page ?? 1;
    const perPage = options.perPage ?? 10;

    if(Entity){
        const myDataSource = dataSource;
        if(!myDataSource.isInitialized){
            await myDataSource.initialize();
        }
        const entityRepository = myDataSource.getRepository(Entity);

        const data = await entityRepository.findAndCount({
            ...query,
            skip: ((page - 1) * perPage),
            take: perPage
        });

        let totalItems = data[1];
        let totalPages = Math.ceil(totalItems / perPage);

        return new PagnationResponseDto(
            200,
            totalItems,
            totalPages,
            page,
            data[0]
        )
    }
    else{
        console.log('Pagnation error: Entity not found');
        
        throw new InternalServerErrorException(new FailResponseDto(
            ['Something went wrong!'],
            'Something went wrong!',
            500
        ));
    }
}