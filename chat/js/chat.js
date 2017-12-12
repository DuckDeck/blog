var socket = io.connect('http://127.0.0.1:3000')




var Chat = function (socket) {
    this.socket = socket
}

Chat.prototype.sendMessage = function (room,text) {
    var message = {
        room:room,text:text
    }
    console.log('sendmessage room:'+message.room + 'message :' + message.text)
    this.socket.emit('message',message)
}

Chat.prototype.changeRoom = function (room) {
      this.socket.emit('join',{newRoom:room})
}

Chat.prototype.processCommand = function (command) {
    var words = command.split(' ')
    var command = words[0].substring(1,words[0].length).toLowerCase()
    var message = false
    console.log(words)
    switch(command){
        case 'join':
        words.shift()
        var room = words.join(' ')
        this.changeRoom(room)
        break
        case 'nick':
        words.shift()
        var name = words.join(' ')
        this.socket.emit('nameAttempt',name)
        break
        default:
        message = 'Unrecognized command'
        break
    }
    return message
}

function divEscapedContentElement(message) {
    return $('<div></div>').text(message)
}
function divSystemConentElement(message){ 
    return $('<div></div>').html('<li>' + message +'</li>')
}

function processUserInput(chatApp,socket) {
    var message = $('#send-message').val()
    var systemMessage;
    if(message.charAt(0) == '/'){
        systemMessage = chatApp.processCommand(message)
        if(systemMessage){
            $('#messages').append(divSystemConentElement(systemMessage))
        }
    }
    else{
        chatApp.sendMessage($('#roomName').text(),message)
        $('#messages').append(divEscapedContentElement(message))
        $('#messages').scrollTop($('#messages').prop('scrollHeight'))
    }
    $('#send-message').val('')
}

$(document).ready(function () {
    var chatApp = new Chat(socket)
    socket.on('connect',function (soc) {
        console.log('socket connect success')
    })
    socket.on('nameResult',function(result){
        var message
        if(result.success){
            message = 'You are now known as' + result.name + ''
        }
        else{
            message = result.message
        }
        $('#messages').append(divSystemConentElement(message))
    })
    socket.on('joinResult',function (result) {
        //$('#room').text(result.room) //这应该写错了
        $('#roomName').text(result.room)
        $('#messages').append(divSystemConentElement('Room changed'))
    }) 
    socket.on('message',function (message) {
        console.log('receive message:'+message.text)
        var newElement = $('<div></div>').text(message.text)
        $('#messages').append(newElement)
    })
    socket.on('rooms',function (rooms) {
        $('#room-list').empty()
        console.log('receive heart data')
        for(var room in rooms){
            room = room.substring(1,room.length)
            if(room != ''){
                $('#room-list').append(divEscapedContentElement(room))
            }
        }
        $('#room-list  div').click(function (){
            chatApp.processCommand('/join '+$(this).text())
            $('#send-message').focus()
        })
    })
    //这里是用于心跳包
    setInterval(function () {
        socket.emit('rooms')
    },1000)

    $('#send-message').focus()
    $('#send-form').submit(function () {
        processUserInput(chatApp,socket)
        return false
    })
    $('#button_alter_nickname').click(function(){
        chatApp.processCommand('/nick '+$('#nick_name').val())
    })
    $('#button_alter_room').click(function(){
        chatApp.processCommand('/join '+$('#change_room').val())
    })
})