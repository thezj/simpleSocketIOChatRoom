const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

let app = express()
app.set('views', './template')
app.set('view engine', 'pug')
app.get('/', (req, res) => {
    res.render('index')
})
let server = http.createServer(app)
server.listen(1717)

let io = socketIO.listen(server)
let users = []

io.on('connection', client => {

    client.on('login', name => {
        if (users.includes(name)) {
            client.emit('duplicate')
        } else {
            users.push(name)
            io.emit('login', name)
            io.emit('refreshUser', users)
        }
    })

    client.on('chat', message => {
        io.emit('chat', message)
    })


    client.on('disconnect', i => {
        users = []
        io.emit('checkName')
    })

    client.on('offLine', name => {
        io.emit('offLine',name)
    })

    client.on('online', username => {
        users.push(username)
        io.emit('refreshUser', users)
    })
})