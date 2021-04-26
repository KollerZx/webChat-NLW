import { io } from "../http"
import { ConnectionsService } from "../services/ConnectionsService"
import { MessageService } from "../services/MessagesService"
io.on("connect", async (socket) =>{
    const connectionsService = new ConnectionsService()
    const messagesService = new MessageService()
    const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin()

    io.emit("admin_list_all_users", allConnectionsWithoutAdmin)

    socket.on("admin_list_messages_by_user", async (params, callback) => {
        const { user_id } = params

        const allMessages = await messagesService.listByUser(user_id)

        callback(allMessages)
    })

    /* admin.js */
    socket.on("admin_send_messages", async params => {
        const {user_id, text} = params;

        await messagesService.create({
            text,
            user_id,
            admin_id:socket.id
        })


        const {socket_id} = await connectionsService.findByUserId(user_id)

        /* Para emitir a mensagem para o usuario -> chat.js */
        io.to(socket_id).emit("admin_send_to_client", {
            text,
            socket_id:socket.id
        })
    })
})