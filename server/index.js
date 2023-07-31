const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http').Server(app)
const PORT = 4000
const socketIO = require('socket.io')(http, {
    cors: {
        // origin: 'http://localhost:5173'
        origin: '*'
    }
})

app.use(cors())
let usersByRoom = {}

socketIO.on('connection', (socket) => {
    socket.on('joinRoom', (data) => {
        const { room } = data
        console.log(`A user joined ${room} on socket ${socket.id}`)
        socket.join(room)

        // Populate dictionary with users for each room
        if (!usersByRoom[room]) {
            usersByRoom[room] = []
        }
        usersByRoom[room].push({ socketID: socket.id })
        socketIO.to(room).emit('newUserResponse', usersByRoom[room])
    })

    socket.on('message', (data) => {
        const { room } = data
        socketIO.to(room).emit('messageResponse', data)
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected')

        // Find the room to which the user belongs
        let userRoom
        for (const room in usersByRoom) {
            if (usersByRoom[room].some((user) => user.socketID === socket.id)) {
                userRoom = room
                break
            }
        }

        // Remove the user from the respective room
        if (usersByRoom[userRoom]) {
            usersByRoom[userRoom] = usersByRoom[userRoom].filter(
                (user) => user.socketID !== socket.id
            )
        }
        // Emit the updated user list for that room
        socketIO.to(userRoom).emit('newUserResponse', usersByRoom[userRoom])
        socket.disconnect()
    })
})

http.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
