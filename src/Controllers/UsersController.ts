import { Request, Response} from "express"
import { UserService } from "../services/UserService"

class UsersController{

    /* :Promise<Response> INFORMA QUE O RETORNO SERÁ UMA PROMISE DO TIPO RESPONSE */
    async create(req: Request, res:Response):Promise<Response>{

        const { email } = req.body;

        const usersService = new UserService()

        const user = await usersService.create(email)
    
        return res.json(user)
    }
}

export {UsersController}