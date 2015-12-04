var mongo = require('mongodb').MongoClient,
	client=require('socket.io').listen(8080).sockets;
	
	mongo.connect('mongodb://127.0.0.1/chat',function(err,db){
	if(err) throw err;
	client.on('connection',function(socket){
	var coll = db.collection('messages');
	//console.log("Some one is connected");
		sendStatus= function(s){
		socket.emit('status',s);
		};
		
		//emit all msg from db...
		coll.find().limit(100).sort({_id:1}).toArray(function(err,res){
		if(err) throw err;
		socket.emit('output',res);
		});
	
	socket.on('input',function(data){
	//for ref in serever we print but have to pass it to db
	console.log(data);
	
	
	var name=data.name,
	message=data.message,
	whiteSpacePattern=/^\s*$/;
	
	if((name!=null)|(message!=null)) 
		{
			
		coll.insert({name: name, message: message},function(){
		//data not getting inserted in db
			console.log("Inserted row in mongodb");
			client.emit('output',[data]);
			//sendSatus({
			//message:'Message Sent',
			//Clear:true
			//});
			});
		}
		else{
		sendStatus('name and message is required');
		}
	
	});
	
		});
	});