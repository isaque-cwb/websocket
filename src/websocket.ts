import { io } from './http'


interface RoomUser {
    username: string,
    room: string,
    socket_id: string
}

interface Message {
    username: string,
    room: string,
    text: string,
    created_at: Date
}

const users: RoomUser[] = []
const messages: Message[] = []


io.on('connection', socket => {
    console.log(socket.id)
    socket.on('select_room', (data, callBack) => {

        socket.join(data.room)

        const userInRoom = users.find(user => user.username === data.username && user.room === data.room)

        if (userInRoom) {
            userInRoom.socket_id = socket.id
        } else {
            users.push({
                room: data.room,
                username: data.username,
                socket_id: socket.id
            })
        }

        const messagesRoom = getMessagesRoom(data.room)
        callBack(messagesRoom)
    })

    socket.on('message', data => {

        const message: Message = {
            username: data.username,
            room: data.room,
            text: data.message,
            created_at: new Date()

        }

        messages.push(message)

        io.to(data.room).emit('message', message)

    })
})


function getMessagesRoom(room: string) {
    const messagesRoom = messages.filter(message => message.room === room)
    return messagesRoom
}