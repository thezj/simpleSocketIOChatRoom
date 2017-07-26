let socket = io.connect()
let chatView = document.querySelector('#chatView')
let userView = document.querySelector('#userView')
let msgInput = document.querySelector('#msgInput')
let username = ''
//弹出输入框，派送login事件
let goLogin = i => {
    username = prompt('请输入用户名')
    socket.emit('login', username)
}

let sendMSG = e => {
    if (event.keyCode === 13) {
        socket.emit('chat', msgInput.value)
        msgInput.value = ''
    }
}

socket.on('connect', i => {
    goLogin()
})

socket.on('login', name => {
    console.log(name, '登录成功')
    chatView.innerHTML += `<P>欢迎“${name}”光临聊天室</P>`
    chatView.scrollTop = 1000000000
    msgInput.focus()
})

socket.on('refreshUser', users => {
    console.log('全部在线', users)
    let userDom = ''
    users.map(name => {
        userDom += `<P>${name}</P>`
    })
    userView.innerHTML = userDom
})

socket.on('duplicate', i => {
    alert('用户名已存在')
    goLogin()
})

socket.on('checkName', i => {
    socket.emit('online', username)
})

socket.on('chat', MSG => {
    console.log('新消息', MSG)
    chatView.innerHTML += `<P>${username}：<br>“${MSG}”</P>`
    chatView.scrollTop = 1000000000
})

socket.on('offLine', name => {
    chatView.innerHTML += `<P>“${name}”已下线</P>`
    chatView.scrollTop = 1000000000
})

window.onbeforeunload = e => {
    socket.emit('offLine', username)
}