var socketio = require('socket.io')
var io
var guestNumber = 1
var nickNames = {}
var namesUsed = []
var currentRoom = {}

exports.listen = function(server){
    io = socketio.listen(server)
    io.set('log level',1)
    io.sockets.on('connection',function(socket){
        console.log(io.sockets.adapter.rooms)
        guestNumber = assignGuestName(socket,guestNumber,nickNames,namesUsed)
        joinRoom(socket,'Lobby')
        handleMessageBroadCasting(socket,nickNames)
        handleNameChangeAttempts(socket,nickNames,namesUsed)
        handleRoomJoining(socket)
        //这里是用于心跳包
        socket.on('rooms',function(){
            socket.emit('rooms',io.sockets.adapter.rooms)
        })
        handleClientDisconnection(socket,nickNames,namesUsed)
    })

}


function assignGuestName(socket,guestNumber,nickNames,namesUsed) {
    var name = 'Guest' + guestNumber
    nickNames[socket.id] = name
    console.log('new user login name is ' + name)
    socket.emit('nameResult',{
        success:true,name:name
    })
    namesUsed.push(name)
    return guestNumber + 1
}


function joinRoom(socket,room) {
      socket.join(room)
      currentRoom[socket.id] = room
      socket.emit('joinResult',{room:room})
      socket.broadcast.to(room).emit('message',{text:nickNames[socket.id] + 'has joined' + room + '.'})
      var usersInRoom =  io.sockets.in(room).clients(function(error, clients){
            if (error) throw error;
         console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
      });
  
      if(usersInRoom.length > 1){
          var usersInRoomSummary = 'Users currently in' + room + ':'
          for(var index in usersInRoom){
              var userSockedId = usersInRoom[index].id
              if(userSockedId != socket.id){
                  if(index > 0){
                      usersInRoomSummary += ', '
                  }
                  usersInRoomSummary += nickNames[userSockedId]
              }
          }
          usersInRoomSummary += '.'
          socket.emit('message',{text:usersInRoomSummary})
      }
}

function handleNameChangeAttempts(socket,nickNames,namesUsed) {
      socket.on('nameAttempt',function(name){
          if(name.indexOf('Guest')==0){
              socket.emit('nameResult',{success:false,message:'Name can not begin wieh "Guest".'})
          }
          else{
              console.log('change name')
              console.log(name)
              if(namesUsed.indexOf(name) == -1){
                  var previousName = nickNames[socket.id]
                  var previousNameIndex = namesUsed.indexOf(previousName)
                  namesUsed.push(name)
                  nickNames[socket.id] = name
                  delete namesUsed[previousNameIndex]
                  console.log('change name is ' + name)
                  socket.emit('nameResult',{success:true,name:name})
                  socket.broadcast.to(currentRoom[socket.id]).emit('message',{text:previousName + 'is now known as' + name + '.'})
              }
              else{
                  socket.emit('nameResult',{success:false,message:'That name is already use.'})
              }
          }
      })
}

function handleMessageBroadCasting(socket) {
    socket.on('message',function (message) {
        console.log('receive message:'+message.text)
        socket.broadcast.to(message.room).emit('message',{text:nickNames[socket.id]+':'+message.text})
    })
}
function handleRoomJoining(socket) {
    socket.on('join',function (room) {
        console.log('receive new room')
        console.log(room)
        socket.leave(currentRoom[socket.id])
        joinRoom(socket,room.newRoom)
    })
}
    
function handleClientDisconnection(socket) {
    socket.on('disconnect',function () {
        var nameIndex = namesUsed.indexOf(nickNames[socket.id])
        // delete namesUsed
        // delete nickNames[socket.id]
     })
}