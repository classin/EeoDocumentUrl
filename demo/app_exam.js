//引入程序包
var express = require('express'),
	path = require('path'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);


var rooms={}

var examsBank={
	'exam_1':{
		examId:'exam_1',
		examName:'第一套试卷',
		questionsList:[
			{
				sn:0,
				title:'问题一：2+1=?',
				type:'choice',
				options:[
					{
						context:'1',
					},
					{
						context:'2',
					},
					{
						context:'3',
						isTrue:true
					},
					{
						context:'4',
					}
				]
			},
			{
				sn:1,
				title:'问题二：2-1=?',
				type:'choice',
				options:[
					{
						context:'1',
						isTrue:true
					},
					{
						context:'2',
					},
					{
						context:'3',
					},
					{
						context:'4',
					}
				]
			},
			{
				sn:1,
				title:'问题三：2*1=?',
				type:'choice',
				options:[
					{
						context:'1',
					},
					{
						context:'2',
						isTrue:true
					},
					{
						context:'3',
					},
					{
						context:'4',
					}
				]
			},
			// {
			// 	sn:2,
			// 	title:'问题三：本问题请选择错误',
			// 	type:'boolean',
			// 	answer:false,
			// },
			// {
			// 	sn:3,
			// 	title:'问题四：AB_%0_DE_%1_G',
			// 	type:'spcaeInput',
			// 	answer:['C','F']
			// },
			// {
			// 	sn:4,
			// 	title:'问题五：随便输入一段话由老师评分',
			// 	type:'textAnswer',
			// }
		]
	}
};

//设置日志级别
io.set('log level', 1);

//WebSocket连接监听
io.on('connection',function(socket) {
	
	// var url = socket.request.headers.referer;
	// var splited = url.split('/');
	// var roomID = splited[splited.length - 1];   // 获取房间ID
	// var user = '';

	// 打印握手信息
	// console.log(socket.handshake);
	
	socket.emit('open', rooms); //通知客户端已连接
	var roomId,userId,userName,roomData,memberData,examData;
	
	function sendUserMessage(messageContent){
		var msgData={
			type:1,
			userId:userId,
			userName:userName,
			serverTime:new Date().getTime(),
			content:messageContent
		}
		roomData.messages.push(msgData);
		socket.emit('messageSendSuccess');
		//socket.emit('message',jsonStr);
		io.to(roomId).emit('message',JSON.stringify(msgData));
	}

	function sendSystemMessage(messageContent){
		var msgData={
			type:0,
			serverTime:new Date().getTime(),
			content:messageContent
		}
		roomData.messages.push(msgData);
		//socket.emit('message',jsonStr);
		io.to(roomId).emit('message',JSON.stringify(msgData));
	}


	socket.on('join',function(jsonStr) {
		var joinData=JSON.parse(jsonStr);
		console.log('joinData',joinData)
		roomId=joinData.roomId;
		userId=joinData.userId;
		userName=joinData.userName;

		if(rooms[roomId]===undefined){
			rooms[roomId]={
				roomId:roomId,
				members:{},
				messages:[],
				examData:'',
			};
		}
		roomData=rooms[roomId];
		if(roomData.members[userId]===undefined){
			roomData.members[userId]={
				userId:userId,
				userName:userName,
				inRoom:false
			}
		}
		memberData=roomData.members[userId];


		socket.join(roomId);
		memberData.inRoom=true;

		socket.emit('joinSuccess');

		io.to(roomId).emit('roomUpdate',JSON.stringify(roomData));
		//socket.emit('messagesReload',JSON.stringify(roomData.messages));

		//io.to(roomId).emit('system',memberData.userName+'（'+memberData.userId+'）加入了房间',roomData);
		//sendSystemMessage(memberData.userName+'（'+memberData.userId+'）加入了房间');
		console.log(memberData.userName+'（'+memberData.userId+'）'+'is join room('+roomId+')')

	});
	
	function broadcastExamStatus(hasSelf){
		if(hasSelf){
			socket.emit('examStatusUpdate',JSON.stringify(roomData.examData));
			socket.to(roomId).emit('examStatusUpdate',JSON.stringify(roomData.examData));
		}else{
			socket.to(roomId).emit('examStatusUpdate',JSON.stringify(roomData.examData));
			//socket.broadcast.to(roomId).emit('examStatusUpdate',JSON.stringify(roomData.examData));
		}
		
	}

	socket.on('examOpen',function(jsonStr) {
		var examId=JSON.parse(jsonStr).examId;
		console.log('roomData.examData',roomData.examData)
		if(roomData.examData===''){
			roomData.examData={
				examSource:JSON.parse(JSON.stringify(examsBank[examId])),
				startTime:new Date().getTime(),
				usersAnswers:{}
			}
			io.to(roomId).emit('examOpenSuccess');
			broadcastExamStatus();
		}else{
			socket.emit('examOpenSuccess',JSON.stringify({
				isContinue:true
			}));
		}
		
	});
	
	socket.on('examStatus',function(jsonStr) {
		if(roomData.examData){
			socket.emit('examStatusUpdate',JSON.stringify(roomData.examData));
		}else{
			io.to(roomId).emit('examStatusUpdate','');
		}
	});


	socket.on('examStop',function(jsonStr) {
		//var examId=JSON.parse(jsonStr).examId;
		console.log('examStop')
		roomData.examData.examEnded=true;
		//io.to(roomId).emit('examOpenSuccess');
		broadcastExamStatus(true);
	});
	socket.on('examClose',function(jsonStr) {
		//var examId=JSON.parse(jsonStr).examId;
		console.log('examClose')
		roomData.examData=''
		//io.to(roomId).emit('examOpenSuccess');
		broadcastExamStatus(true);
	});


	socket.on('choiceOption',function(jsonStr) {
		if(roomData.examData){
			var usersAnswers=roomData.examData.usersAnswers;
			if(usersAnswers[userId]===undefined){
				usersAnswers[userId]=[];
			}
			var userAnswers=usersAnswers[userId];
			var answerData=JSON.parse(jsonStr);
			userAnswers[answerData.questionIndex]=answerData.optionIndex;
			
			broadcastExamStatus(true);
		}
	});



	//监听出退事件
	socket.on('leave',function() {
		socket.emit('disconnect');
	});
	//监听出退事件
	socket.on('disconnect',function() {
		if(rooms[roomId] && rooms[roomId].members[userId]){
			rooms[roomId] && rooms[roomId].members[userId] && (rooms[roomId].members[userId].inRoom=false);

			socket.leave(roomId);
			io.to(roomId).emit('roomUpdate',JSON.stringify(roomData));
			
			socket.emit('leaveSuccess');
			//io.to(roomId).emit('systemMessage',memberData.userName+'（'+memberData.userId+'）离开了房间',roomData);
			sendSystemMessage(memberData.userName+'（'+memberData.userId+'）离开了房间');
			console.log(memberData.userName+'（'+memberData.userId+'）'+'is leave room('+roomId+')');
		}
		
	});


	// 对message事件的监听
	socket.on('message',function(jsonStr) {
		sendUserMessage(JSON.parse(jsonStr).content)
	});


});

//express基本配置
app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development',function() {
	app.use(express.errorHandler());
});

// 指定webscoket的客户端的html文件
app.get('/',function(req, res) {
	res.sendfile('index.html');
});
app.get('/*',function(req, res) {
	res.sendfile(req.params[0]);
});

server.listen(app.get('port'),function() {
	console.log("Express server listening on port " + app.get('port'));
});