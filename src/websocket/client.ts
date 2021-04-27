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

        /* Recupera todas as mensagens ja enviadas pelo usuario e emite um evento 
        passando essas mensagens */
        const allMessages = await messageService.listByUser(user_id)

        socket.emit("client_list_all_messages", allMessages)

        /* admin.js */
        const allUsers = await connectionsService.findAllWithoutAdmin()
        io.emit("admin_list_all_users", allUsers)
    })

    socket.on("client_send_to_admin", async params => {
        const { text, socket_admin_id } = params

        const socket_id = socket.id
        /* com o id do socket do usuario pegamos o id do usuario */
        const { user_id } = await connectionsService.findBySOcketID(socket_id)
        const message = await messageService.create({
            text,
            user_id
        })

        /* emitindo evento para o admin.js */
        io.to(socket_admin_id).emit("admin_receive_message", {
            message,
            socket_id
        })
    })
})
