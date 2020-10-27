const { verifyTokenSocket } = require('./verify');
const { UserModel } =require('../models/user');
const { ChatModel } =require('../models/chat');

const connectedUsers = []; //{"socketId": socket, "userId": user_id}

const socket = function(io) {

	io.on('connection', function(socket) {		
		
		// --->>>connectedUsers.find(user => user.socketId === socket.id) //Aixo busca el user en connected users

		/*//Checking connection
		if(!socket.handshake.query.token){
			console.log('Unable to verify token')
			socket.disconnect();
			return;
		} else{
			const user = connectedUsers.find(function(user) { 
					return user.userId = socket.handshake.query.token;
				})
			if(user){}
			else{
				let userId = verifyTokenSocket(socket.handshake.query.token)
				if(userId){
					const user = {socketId: socket.id, userId: userId._id};
					socket.user = userId;
					connectedUsers.push(user);
					socket.authenticated = true;
					console.log('Token verified')
				} else{
					console.log('Unable to verify token')
					socket.disconnect();
					return;
				}
			}
		}*/
		console.log(connectedUsers)
		//un socket login per guardar el socket nou de cada user conectat
		//aqui suposo que s'hauria de entrar a tots els chats
		socket.authenticated = false;
		socket.on('auth', function(info) {
			console.log("--> Checking token ----------------")
			if(!info){
				socket.disconnect();
				return;
			}
			let userId = verifyTokenSocket(info.token)
			if(userId){
				const user = {socketId: socket.id, userId: userId._id};
				connectedUsers.push(user);
				console.log('test', connectedUsers.find(x => x.socketId === socket.id));
				socket.authenticated = true;
			} else{
				socket.disconnect();
				console.log('--> Unable to verify token')
				return;
			}
		})

		//al fer dc fa delete del user en el socket
		socket.on('disconnect', function(info) {
			if(!socket.authenticated) {
				socket.disconnect();
				return;
			}
			for(var i=0; i<connectedUsers.length; i++) {
				if(connectedUsers[i].socketId == socket.id) {
					console.log('--> disconnecting user ', connectedUsers[i]);
					delete connectedUsers[connectedUsers[i]];
				}
			}
		})

		//t'uneixes a una chatroom, el nom del qual li pases dintre de info
		socket.on('join chatRoom with bd', function(info) {
			if(!socket.authenticated) {
				socket.disconnect();
				return;
			}
			if(!info.room) return;
			//afegim al chat el usuari
			ChatModel.findOneAndUpdate({
					query: { _id : info.chatId },
					update: { $push: {members: info.userId } }, 
			})
			//el nom de la room sera unic o sera el chatId ja es veura
			//tuneixes a la sala i avises als altres
			socket.join(info.room)
			socket.broadcast.to(info.room).emit(info.user + " joined the chatroom")
		})

		//llista de les rooms en les que estas
		socket.on('list rooms', function(info) {
			let rooms = Object.keys(socket.rooms);
			console.log('--> Listing rooms', rooms);
			socket.to(socket.id).emit(rooms);
		})

		//t'uneixes a una chatroom, el nom del qual li pases dintre de info
		socket.on('join chatRoom', function(info) {
			console.log(info)
			if(!socket.authenticated) {
				socket.disconnect();
				return;
			}
			if(!info.room) return;
			//el nom de la room sera unic o sera el chatId ja es veura
			//tuneixes a la sala i avises als altres
			socket.join(info.room)
			socket.broadcast.to(info.room).emit(info.user + " joined the chatroom")
		})

		//llista de les rooms en les que estas
		socket.on('list rooms', function(info) {
			let rooms = Object.keys(socket.rooms);
			console.log('--> Listing rooms', rooms);
			socket.to(socket.id).emit(rooms);
		})


		//envia un nou missatge a una socket.id que li pases
		//nomes per privats
		//s'hauria de passar per info el teu id, el id del destinatari, el id del chat si en te, el missatge i el tipus de missatge(private)
		socket.on('new private message', function(info) {
			if(!socket.authenticated) {
				socket.disconnect();
				return;
			}
			else{
				//existeix ja un chat
				if(info.chatId){
					ChatModel.findAndModify({
						query: { _id : info.chatId },
						update: { $push: {messages: { user: info.userId, text: info.message, messageType: info.messageType} } }, 
					}).then((result)=>{
						//resultat
						console.log("Teoricament ha creat un missatge nou")
					})
				}
				else{
					//afegim el missatge i el chat a la bd
					ChatModel.insert( {
					 	members:  [ info.userId, info.recieverUserId ] , chatType: "private", messages: { user:info.userId, text: info.message, messageType: info.messageType}
					})
					.then((result)=>{
						//resultat
						console.log("Teoricament ha creat un chat nou")
					})
				}

				//mirem si a qui li enviem el missatge esta online, en cas negatiu user sera undefined
				const user = connectedUsers.find(x => x.userId === info.recieverUserId)

				//s'envia el missatge si esta online
				if(connectedUsers[user.socketId]){

					socket.to(user.socketId).emit('new private message', info);
					//socket.to(info.channelID).emit('new private message', info);
				}
				//BORRAR s'envia igual si no esta onlina, a ver que pasa
				else{ 
					socket.to(user.socketId).emit('new private message', info);
					//socket.to(info.channelID).emit('new private message', info);
				}
			}
		});
		socket.on('new message', function(info) {
			if(!socket.authenticated) {
				socket.disconnect();
				return;
			}
			else{
				let messageType = info.messageType ? info.messageType : 'text';
				let user = connectedUsers.find(user => user.socketId === socket.id);
				//existeix ja un chat
				if(info.chatId){
					ChatModel.findOneAndUpdate(
						{ _id : info.chatId },
						{ $push: {messages: { user: user.userId, text: info.message.text, messageType: messageType} } }, 
						{new: true}
					).then((result)=>{
						//resultat
						console.log("Teoricament ha creat un missatge nou", info)
						socket.broadcast.to(info.chatId).emit(info.chatId, { message: info.message});
						//io.sockets.in(info.chatId).emit('group message', { message: info.message});
					})
				}
				else{
					//afegim el missatge i el chat a la bd
					ChatModel.insert( {
					 	members:  [ user.userId, info.recieverUserId ] , chatType: "private", messages: { user:user.userId, text: info.message.text, messageType: messageType}
					})
					.then((result)=>{
						//resultat
						socket.broadcast.to(info.chatId).emit(info.chatId, { message: info.message});
						console.log("Teoricament ha creat un chat nou")
					})
				}
			}
		});
		
		//missatge de grup 
		socket.on('new group message', function(info) {
			if(!socket.authenticated) {
				socket.disconnect();
				return;
			}
			else{
				let messageType = info.messageType ? info.messageType : 'text';
				let user = connectedUsers.find(user => user.socketId === socket.id);
				//existeix ja un chat
				if(info.chatId){
					ChatModel.findOneAndUpdate(
						{ _id : info.chatId },
						{ $push: {messages: { user: user.userId, text: info.message.text, messageType: messageType} } }, 
						{new: true}
					).then((result)=>{
						//resultat
						console.log("Teoricament ha creat un missatge nou", info)
						socket.broadcast.to(info.chatId).emit(info.chatId, { message: info.message});
						//io.sockets.in(info.chatId).emit('group message', { message: info.message});
					})
				}
			}

		});

		// teoricament se li pasa dintre de info una llista de usuaris i el nom de la sala
		socket.on('new chatRoom', function(info) {
			if(!socket.authenticated) {
				socket.disconnect();
				return;
			}
			else{
				
				ChatModel.insert({
					members:  info.members, name: info.groupName, chatType: "Group", messages: { user:info.userId, text: 'Grup creat', messageType: 'text'}
				}).then(result =>{
					for(var i = 0; i< info.users.length; i++){
						const user = connectedUsers.find(function(element) { 
							return element.userId = info.users[i];
						})
						let socketUser = user.socketId
						socketUser.join(result._id);
						//aixo teoricament posa el usuari dintre la sala
					}
				})		
			}
		});
	})
}

/*
const sockets = function(io) {
  
  io.sockets.on('connection', function (socket) {
	cron(socket);

	socket.on('action', (action) => {
	  switch(action.type) {
		case 'SOCKET_USER_LOGIN': {
		  User.findByIdAndUpdate(
			action.userID,
			{ $set: { isOnline: true, socketID: socket.id } },
			{ safe: true, upsert: true, new: true, select: '-chatRooms -blockedUsers -socketID' },
		  )
		  .then((user) => {
			connectedUsers[socket.id] = user._id;

			socket.broadcast.emit('action', {
			  type: 'SOCKET_BROADCAST_USER_LOGIN',
			  user: user,
			});
		  })
		  .catch((error) => {
			console.log(error);
		  });
		  break;
		}
		case 'SOCKET_EDIT_ACTIVE_USER':
		  socket.broadcast.emit('action', {
			type: 'SOCKET_BROADCAST_EDIT_ACTIVE_USER',
			user: action.user,
		  });
		  break;
		case 'SOCKET_JOIN_CHAT_ROOM': {
		  socket.join(action.chatRoomID);
		  break;
		}
		case 'SOCKET_LEAVE_CHAT_ROOM': {
		  socket.leave(action.chatRoomID);
		  break;
		}
		case 'SOCKET_IS_TYPING': {
		  socket.broadcast.to(action.chatRoomID).emit('action', {
			type: 'SOCKET_BROADCAST_IS_TYPING',
			typer: action.typer,
			chatRoomID: action.chatRoomID,
		  });
		  break;
		}
		case 'SOCKET_IS_NOT_TYPING': {
		  socket.broadcast.to(action.chatRoomID).emit('action', {
			type: 'SOCKET_BROADCAST_IS_NOT_TYPING',
			typer: action.typer,
			chatRoomID: action.chatRoomID,
		  });
		  break;
		}
		case 'SOCKET_CREATE_CHAT_ROOM': {
		  for (let i = 0; i < action.members.length; i += 1) {
			const chatRoomMember = action.members[i];

			User.findById(chatRoomMember)
			  .then((user) => {
				socket.broadcast.to(user.socketID).emit('action', {
				  type: 'SOCKET_BROADCAST_CREATE_CHAT_ROOM',
				  chatRoom: action.chatRoomBroadcast,
				});
			  })
			  .catch((error) => {
				console.log(error);
			  });
		  }
		  break;
		}
		case 'SOCKET_SEND_MESSAGE': {
		  let chatRoomClients = [];
		  let blockedUsers = [];

		  io.in(action.chatRoomID).clients((err, clients) => {
			if (!err) {
			  chatRoomClients = clients;
			}
		  });

		  User.findById(action.userID, 'blockedUsers')
			.then((user) => {
			  blockedUsers = user.blockedUsers;

			  return ChatRoom.findById(action.chatRoomID)
				.populate('members')
				.exec();
			})
			.then((chatRoom) => {
			  const usernames = [];

			  if (action.message.text.length > 0) {
				const taggedUsernames = action.message.text.match(/<@(\w+)>/ig);

				if (taggedUsernames !== null && taggedUsernames.length > 0) {
				  for (let i = 0; i < taggedUsernames.length; i += 1) {
					usernames.push(taggedUsernames[i].slice(2, -1));
				  }
				}
			  }

			  for (let i = 0; i < chatRoom.members.length; i += 1) {
				const chatRoomMember = chatRoom.members[i];

				if (blockedUsers.indexOf(chatRoomMember._id) === -1) {
				  User.findById(chatRoomMember._id)
					.populate({
					  path: 'chatRooms.data',
					  select: '-members',
					})
					.exec()
					.then((user) => {
					  if (user.blockedUsers.indexOf(action.userID) === -1) {
						if (chatRoomClients.indexOf(user.socketID) > -1) {
						  User.updateOne(
							{ _id: user._id, 'chatRooms.data': action.chatRoomID },
							{ $set: { 'chatRooms.$.unReadMessages': 0 } },
							{ safe: true, upsert: true, new: true }
						  ).exec();

						  socket.broadcast.to(user.socketID).emit('action', {
							type: 'SOCKET_BROADCAST_SEND_MESSAGE',
							message: action.message
						  });
						} else {
						  const chatRoomIndex = user.chatRooms.findIndex(singleChatRoom => {
							return singleChatRoom.data._id == action.chatRoomID && !singleChatRoom.mute.data;
						  });

						  if (chatRoomIndex > -1) {
							const singleChatRoom = user.chatRooms[chatRoomIndex];
							let socketNotifyType = 'SOCKET_BROADCAST_NOTIFY_MESSAGE';

							if (singleChatRoom.data.chatType === 'direct') {
							  singleChatRoom.data.name = action.message.user.name;
							  singleChatRoom.data.chatIcon = action.message.user.profilePicture;
							  singleChatRoom.data.members = chatRoom.members;
							}

							if (usernames.length > 0 && usernames.indexOf(user.username) > -1) {
							  socketNotifyType = 'SOCKET_BROADCAST_NOTIFY_MESSAGE_MENTION';
							}

							socket.broadcast.to(user.socketID).emit('action', {
							  type: socketNotifyType,
							  chatRoom: singleChatRoom,
							  chatRoomID: action.chatRoomID,
							  chatRoomName: singleChatRoom.data.name,
							  senderName: action.message.user.name,
							});
						  }
						}
					  }
					})
					.catch((error) => {
					  console.log(error);
					});
				}
			  }
			})
			.catch((error) => {
			  console.log(error);
			});
		  break;
		}
		case 'SOCKET_DELETE_MESSAGE': {
		  let chatRoomClients = [];

		  io.in(action.chatRoomID).clients((err, clients) => {
			if (!err) {
			  chatRoomClients = clients;
			}
		  });

		  ChatRoom.findById(action.chatRoomID)
			.populate('members')
			.exec()
			.then((chatRoom) => {
			  for (let i = 0; i < chatRoom.members.length; i += 1) {
				const chatRoomMember = chatRoom.members[i];

				User.findById(chatRoomMember._id)
				  .then((user) => {
					if (chatRoomClients.indexOf(user.socketID) > -1) {
					  socket.broadcast.to(user.socketID).emit('action', {
						type: 'SOCKET_BROADCAST_DELETE_MESSAGE',
						messageID: action.messageID,
						chatRoomID: action.chatRoomID,
					  });
					}
				  })
				  .catch((error) => {
					console.log(error);
				  });
			  }
			})
			.catch((error) => {
			  console.log(error);
			});
		  break;
		}
		case 'SOCKET_REQUEST_VIDEO_CALL': {
		  let callerUser = {};

		  User.findById(action.callerID, '-chatRooms -blockedUsers -socketID')
			.then((user) => {
			  callerUser = user;

			  return User.findById(action.receiverID);
			})
			.then((user) => {
			  socket.broadcast.to(user.socketID).emit('action', {
				type: 'SOCKET_BROADCAST_REQUEST_VIDEO_CALL',
				user: callerUser,
				peerID: action.peerID,
			  });
			})
			.catch((error) => {
			  console.log(error);
			});
		  break;
		}
		case 'SOCKET_CANCEL_REQUEST_VIDEO_CALL':{
		  User.findById(action.receiverID)
			.then((user) => {
			  socket.broadcast.to(user.socketID).emit('action', {
				type: 'SOCKET_BROADCAST_CANCEL_REQUEST_VIDEO_CALL',
			  });
			})
			.catch((error) => {
			  console.log(error);
			});
		  break;
		}
		case 'SOCKET_REJECT_VIDEO_CALL': {
		  User.findById(action.callerID)
			.then((user) => {
			  socket.broadcast.to(user.socketID).emit('action', {
				type: 'SOCKET_BROADCAST_REJECT_VIDEO_CALL',
			  });
			})
			.catch((error) => {
			  console.log(error);
			});
		  break;
		}
		case 'SOCKET_ACCEPT_VIDEO_CALL': {
		  User.findById(action.callerID)
			.then((user) => {
			  socket.broadcast.to(user.socketID).emit('action', {
				type: 'SOCKET_BROADCAST_ACCEPT_VIDEO_CALL',
				peerID: action.peerID,
			  });
			})
			.catch((error) => {
			  console.log(error);
			});
		  break;
		}
		case 'SOCKET_END_VIDEO_CALL': {
		  User.findById(action.callerID)
			.then((user) => {
			  socket.broadcast.to(user.socketID).emit('action', {
				type: 'SOCKET_BROADCAST_END_VIDEO_CALL',
			  });
			})
			.catch((error) => {
			  console.log(error);
			});
		  break;
		}
		default:
		  break;
	  }
	});

	socket.on('disconnect', function() {
	  User.findByIdAndUpdate(
		connectedUsers[socket.id],
		{ $set: { isOnline: false, socketID: '' } },
		{ safe: true },
	  )
	  .then((user) => {
		if ( user !== null && user._id !== null ) {
		  socket.broadcast.emit('action', {
			type: 'SOCKET_BROADCAST_USER_LOGOUT',
			userID: user._id,
		  });
		}

		delete connectedUsers[socket.id];
	  })
	  .catch((error) => {
		console.log(error);
	  });
	});

	User.find({_id: {$ne: null}})
	  .then((users) => {
		for (let i = 0; i < users.length; i += 1) {
		  const user = users[i];

		  if (!(user.socketID in connectedUsers) && connectedUsers[user.socketID] != user._id) {
			User.findByIdAndUpdate(
			  user._id,
			  { $set: { isOnline: false, socketID: ''} },
			  { safe: true, upsert: true, new: true },
			).exec();
		  }
		}
	  })
	  .catch((error) => {
		console.log(error);
	  });
  });
}
*/

module.exports = socket;