
const socket = io()

const urlSeach = new URLSearchParams(window.location.search)
const username = urlSeach.get('username')
const room = urlSeach.get('select_room')


const userdiv = document.getElementById('username')
userdiv.innerHTML += `
<div id="username">
    Olá <strong>${username}</strong> - Você está na sala: <strong>${room}</strong>
</div>
`

socket.emit(
    'select_room',
    { username, room },
    (messages) => {
        messages.forEach(message => createMessage(message));
    }
)

document.getElementById('message_input').addEventListener('keypress', event => {

    if (event.key === 'Enter') {
        event.preventDefault()
        const message = event.target.value
        event.target.value = ''

        const data = {
            username,
            room,
            message
        }


        socket.emit('message', data)
    }
})

socket.on('message', data => {
    createMessage(data)
})

function createMessage(data) {
    const messagesDiv = document.getElementById('messages')
    messagesDiv.innerHTML += `
    <div class="new_message">
        <label class="form-label">
        <strong>${data.username}: </strong> <span >${data.text} - </span> <span class="message-date" >${dayjs(data.created_at).format('DD/MM HH:mm')}</span>
        </label>
    </div>
   `


    setTimeout(() => {
        const containerNewMessageDiv = document.getElementById('container-new-message')
        containerNewMessageDiv.scrollTop = containerNewMessageDiv.scrollHeight
    }, 0)

}

document.getElementById('logout').addEventListener('click', (event) => {
    event.preventDefault()
    window.location.href = 'index.html'
})