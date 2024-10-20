import dataSource from "../data-source";
import { Role } from "../entities/Role.entity";


async function addRoles(){
    try {
        const myDataSource = await dataSource.initialize();
        console.log('data source initialize successfully..');
        
        const roles = [
            { name: 'Provider' },
            { name: 'Customer' },
            { name: 'Admin' },
        ];

        await myDataSource.manager.save(Role, roles);
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

addRoles()
.catch(error => { console.log(error) });