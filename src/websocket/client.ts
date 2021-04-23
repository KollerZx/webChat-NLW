import { io } from "../http"
import { ConnectionsService } from "../services/ConnectionsService"
import { UserService } from "../services/UserService"
import { MessageService} from "../services/MessagesService"

interface IParams{
    text: string
    email:string
}
io.on("connect", (socket) => {
    const connectionsService = new ConnectionsService()
    const userService = new UserService()
    const messageService = new MessageService()

    socket.on("client_first_access", async (params) => {
        const socket_id = socket.id

        const { text, email } = params as IParams

        let user_id = null
        const userExists = await userService.findByEmail(email)

        if (!userExists) {
            const user = await userService.create(email)
            await connectionsService.create({
                socket_id,
                user_id: user.id
            })
            user_id = user.id
        }
        else {
            user_id = userExists.id
            const connection = await connectionsService.findByUserId(userExists.id)
            
            if(!connection){
                await connectionsService.create({
                    socket_id,
                    user_id: userExists.id
                })
                
            }else{
                connection.socket_id = socket_id
                await connectionsService.create(connection)
            }
            
            
        }

        await messageService.create({
            text,
            user_id
        })

        //salvar a conexao com o socket_id, user_id
    })
})
