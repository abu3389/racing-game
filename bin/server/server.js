var myServer=require("ws").Server;
var mySocket=new myServer({ip:"127.0.0.1",port:5566});
var MD5=require("md5");
var UserDAO=require("./UserDAO.js");
console.log("服务正在运行！");
//在线客户端数组
var aClient=[];
//在线登录用户数组
var aLoginClient=[];
//匹配用户数组
var matchClient=[];
//比赛用户数组
var gameClient=[];
// 用户上线处理
mySocket.on("connection",function(client){
	//存放上线客户端的数组
	aClient.push(client);
	console.log("有客户端上线！当前在线人数："+aClient.length);
	// 用户收到消息事件响应
	client.on("message",function(msg){
		//解析消息
		var parseMsg=JSON.parse(msg);
		console.log("有客户端消息！消息内容为：");
		console.log(parseMsg);
        msgEventChoose(parseMsg,client);
	});
    //用户关闭事件响应
	client.on("close",function(){
        for(var i=0;i<aClient.length;i++){
        	if(aClient[i]==client){
        		aClient.splice(i,1);
        		break;
        	}
        }
        console.log("有客户端下线！当前在线人数："+aClient.length);
	});
});

/**
 * [设置服务器收到消息时选择事件]
 * @param  {[object]} parseMsg [接收到的消息包对象]
 * @return {[type]}          [description]
 */
function msgEventChoose(parseMsg,client){
  switch(parseMsg.type_){
  	case "login":
  	//用户登录响应事件
  	loginMsgEvent(parseMsg,client);
  	break;
  	case "regist":
  	//用户注册响应事件
    regMsgEvent(parseMsg,client);
  	break;
  	case "update":
  	//用户更新响应事件
  	userUpdateEvent(parseMsg,client);
  	break;
  	case "chat":
  	//用户聊天消息响应事件
  	userChatEvent(parseMsg,client);
  	break;
  	case "addLoginClient":
  	//登录用户数组添加登录用户响应事件
  	addLoginClientEvent(parseMsg,client);
  	break;
  	case "reduceLoginClient":
  	//登录用户数组删除登录用户响应事件
  	reduceLoginClientEvent(parseMsg,client);
  	break;
  	case "match":
  	//用户匹配请求响应事件
  	macthClientEvent(parseMsg,client);
  	break;
  	case "deleteMatchClient":
  	//离线用户请求清空服务端的匹配数组响应事件
  	deleteMatchClientEvent(parseMsg,client);
  	break;
  	case "gamePoint":
  	//游戏坐标接收响应事件
  	resGamepoint(parseMsg,client);
  	break;
  	case "getZhangAi":
  	//游戏障碍物坐标生成请求响应事件
    getZhangAiGetMessage(parseMsg);
    break;
    case "gameFirstEnd":
    //游戏第一名结束响应事件
    gameFirstEndGetMessage(parseMsg,client);
    break;
    case "gameSecondEnd":
    //游戏第二名结束响应事件
    gameSecondEndGetMessage(parseMsg,client);
    break;
    case "getGameRecord":
    //用户请求游戏记录响应事件
    getGameRecord(parseMsg,client);
    break;
  }
}
//用户登录响应事件
function loginMsgEvent(parseMsg,client){
	//设置消息包的密码为MD5
    parseMsg.userPwd_=MD5(parseMsg.userPwd_);
	UserDAO.userLogin(parseMsg,function(ret){
		//判断是否有符合的用户名、密码
        if(ret[0].user_name){
        	//登录用户追加进登录用户数组
			aLoginClient.push({"userName_":parseMsg.userName_,"client_":client});
			console.log("当前用户登录数："+aLoginClient.length);
        	var Msg={
        		type_:"login",
        		result_:1,
        		contex_:ret
        	}
        }
        //判断是否没有找到
        if(ret=="noFind"){
        	var Msg={
        		type_:"login",
        		result_:0
        	}        	
        }
        //返回登录结果
        client.send(JSON.stringify(Msg));
        //发送在线登录用户人数
        sendLoginNum();
        //发送最近20条聊天信息
        sendPastChat(client);
        console.log("服务器返回"+ret[0].user_name+"登录消息：");
        console.log(Msg);
	});
}
//用户注册响应事件
function regMsgEvent(parseMsg,client){
    //设置消息包的密码为MD5
    parseMsg.userPwd_=MD5(parseMsg.userPwd_);
    UserDAO.userReg(parseMsg,function(ret){
    	//判断是否注册成功
        if(ret=="success"){
       	  var Msg={
       	  	type_:"regist",
       	  	result_:1
       	  }
       	}
       	//判断是否注册失败
    	if(ret=="faild"){
    	var Msg={
	       	type_:"regist",
	       	result_:0
	       	}
    	}
    	//判断是否已存在该用户
    	if(ret=="exist"){
    	var Msg={
	       	type_:"regist",
	       	result_:2
	       	}
    	}
        client.send(JSON.stringify(Msg));
        //发送在线登录用户人数
        sendLoginNum();
        console.log("服务器返回注册消息：");
        console.log(Msg);
    });
}
//用户更新信息响应事件
function userUpdateEvent(parseMsg,client){
	UserDAO.userLogin(parseMsg,function(ret){
		//判断是否有符合的用户名、密码
        if(ret[0].user_name){
        	var Msg={
        		type_:"update",
        		result_:1,
        		contex_:ret
        	}
        }
        //判断是否没有找到
        if(ret=="noFind"){
        	var Msg={
        		type_:"update",
        		result_:0
        	}        	
        }
        client.send(JSON.stringify(Msg));
        //发送在线登录用户人数
        sendLoginNum();
        //发送最近20条聊天信息
        sendPastChat(client);
        console.log("服务器返回"+ret[0].user_name+"更新消息：");
        console.log(Msg);
	});
}

//用户聊天消息响应事件
function userChatEvent(parseMsg,client){
   UserDAO.userChat(parseMsg,function(ret){
   	    var Msg={
   	    	type_:"chat",
   	    	contex_:ret
   	    }
        for(var i=0;i<aLoginClient.length;i++){
        	aLoginClient[i].client_.send(JSON.stringify(Msg));
        }
	   	console.log("服务器群发"+aLoginClient.length+parseMsg.userName_+"聊天消息：");
	   	console.log(Msg);
   });
}
//登录用户数组添加登录用户响应事件
function addLoginClientEvent(parseMsg,client){
   aLoginClient.push({"userName_":parseMsg.userName_,"client_":client});
   console.log("当前用户登录数："+aLoginClient.length);
   sendLoginNum();
}
//登录用户数组删除登录用户响应事件
function reduceLoginClientEvent(parseMsg,client){
	for(var i=0;i<aLoginClient.length;i++){
		if(aLoginClient[i].userName_==parseMsg.userName_){
			aLoginClient.splice(i,1);//移除该登录用户
			console.log("当前用户登录数："+aLoginClient.length);
			break;
		}
	}
	sendLoginNum();
}
//离线用户请求清空服务端的匹配数组响应事件
function deleteMatchClientEvent(parseMsg,client){
    //判断当前请求的用户是否在匹配用户数组里面
    for(var i=0;i<matchClient.length;i++){
   	    //如果存在匹配用户数组里，则清空匹配用户数组（单用户等待状态）
   	    if(matchClient[i].userInfo_.userName_==parseMsg.userName_){
            matchClient=[];
            console.log("单用户匹配等待状态，匹配取消");
            return;
   	    }   
   	}
  	//如果不存在，则判断当前请求的用户是否在比赛用户数组里面（双用户匹配成功状态）
  	for(var j=0;j<gameClient.length;j++){
  		for(var k=0;k<gameClient[j].length;k++){
  			//如果存在比赛用户数组里，则清除比赛用户数组该用户项
  			if(gameClient[j][k].userInfo_.userName_==parseMsg.userName_){
	            gameClient[j].splice(k,1);//清除比赛用户数组该用户项
	            //判断对手是否存在,不存在不发包
	            if(!gameClient[j][0].userInfo_.userName_){
	               //删除比赛数组中该空的匹配数组
	               gameClient.splice(j,1);
	               console.log("双用户匹配成功，双方离线状态，双方匹配取消");
	               return;
	            }else{
	            	//存在则发包给对手告知下线
	            	gameClient[j][0].client_.send(JSON.stringify({type_:"matchCancel",userName_:gameClient[j][0].userInfo_.userName_}));
	            	//重新加入匹配数组等待匹配
	            	matchClient.push(gameClient[j][0]);
                    //删除比赛数组中该匹配数组
	                gameClient.splice(j,1);
	            	console.log("双用户匹配成功，单方离线状态，在线方重新匹配");
	            	console.log("当前匹配中人数:"+matchClient.length);
	            	return;
	            }
	            break;
  			} 
  		}
  	}
    console.log("当前匹配成功数："+gameClient.length);
}

//用户匹配请求响应事件
function macthClientEvent(parseMsg,client){
   //判断登录用户是否存在该用户
   for(var i=0;i<aLoginClient.length;i++){
   	  if(aLoginClient[i].userName_==parseMsg.userName_){
   	  	 console.log("登录用户数组存在"+parseMsg.userName_+"用户");
   	  	 //追加匹配用户客户端数组
   	  	 matchClient.push({client_:client,userInfo_:parseMsg});
   	  	 console.log("当前匹配中人数:"+matchClient.length);
   	  	 //追加
   	  	 //判断用户数组人数是否等于2
   	  	 if(matchClient.length==2){
            var aUserInfo=[];
            //获取服务器时间
            var nowTime=getServerTime();
            //循环匹配数组获取匹配成功用户信息
            for(var k=0;k<matchClient.length;k++){
                aUserInfo.push(matchClient[k].userInfo_);
            }
            //循环匹配数组发送匹配数据
            for(var j=0;j<matchClient.length;j++){
            	//创建匹配数据包
            	var Msg={
                   type_:"matchResult",
                   contex_:aUserInfo,
                   createTime_:nowTime,
            	}
            	matchClient[j].client_.send(JSON.stringify(Msg));
            }
            console.log("服务器群发玩家"+aUserInfo[0].userName_+"和玩家"+aUserInfo[1].userName_+"匹配数据：");
	   	    console.log(Msg);
	   	    //随机生成障碍物坐标并存入障碍数组
            createZhangai();
	   	    //存入比赛数组
            gameClient.push(matchClient);
            console.log(gameClient);
            console.log("当前匹配成功数："+gameClient.length);
            //清空匹配数组
            matchClient=[];
   	  	 }
   	  	 break;
   	  }
   }
}
//游戏坐标接收响应事件
function resGamepoint(parseMsg,client){
	// console.log(gameClient);
	//循环查找比赛数组中的玩家
	for(var i=0;i<gameClient.length;i++){
		for(var j=0;j<2;j++){
			//找到比赛数组该玩家
			if(gameClient[i][j].userInfo_.userName_==parseMsg.userName_){
                if(j==0){
                  var k=1;
                }else{
                  var k=0;
                }
                //如果存在对手则发送该该玩家的坐标信息
                if(gameClient[i][k].userInfo_.userName_==parseMsg.toUserName_){
                    gameClient[i][k].client_.send(JSON.stringify(parseMsg));
                    // console.log("对手坐标发送成功！");
                    break;      
                }
            break
			}
		}
	}
}
//服务端接收障碍物请求事件
function getZhangAiGetMessage(parseMsg){
    for(var i=0;i<gameClient.length;i++){
   	   for(var j=0;j<gameClient[i].length;j++){
            //找到比赛数组该玩家
		    if(gameClient[i][j].userInfo_.userName_==parseMsg.userName_){
		    	for(var k=0;k<2;k++){
                   	gameClient[i][k].client_.send(JSON.stringify({"type_":"getZhangAi","zhangai_":gameClient[i][2]}));
		    	}
		    	console.log(gameClient[i][2]);
		    }
		    break;
   	   }
    }
}
//游戏第一名结束响应事件
function gameFirstEndGetMessage(parseMsg,client){
	console.log("收到玩家第一名游戏结束信息："+parseMsg);
    //处理比赛结束记录存入业务
    UserDAO.setGameFirstEndRecord(parseMsg,
    	function(ret){
	        if(ret=="success"){
	       	 //判断比赛数组中是否存在对手,存在则告知比赛结束
				for(var i=0;i<gameClient.length;i++){
					for(var j=0;j<2;j++){
						//找到比赛数组该对手
						if(gameClient[i][j].userInfo_.userName_==parseMsg.parternerName_){
							//发送比赛结束信息
	                        gameClient[i][j].client_.send(JSON.stringify({"type_":"gameEnd"}));
	                        console.log("第一名比赛结束信息发送第二名成功");
			                break;
						}
					}
				}
	        }
        },function(ret1){
            console.log("第一名用户升级："+ret1);
            client.send(JSON.stringify({"type_":"levelUp","nowLevel_":ret1}));
    });
}
//游戏第二名结束响应事件
function gameSecondEndGetMessage(parseMsg,client){
	console.log("收到玩家第二名游戏结束信息："+parseMsg);
  console.log(parseMsg.userName_);
    //处理比赛结束记录存入业务
    UserDAO.setGameSecondEndRecord(parseMsg,function(ret){
    },function(ret1){
            console.log("第二名用户升级："+ret1);
            client.send(JSON.stringify({"type_":"levelUp","nowLevel_":ret1}));
    });
}
//用户请求游戏记录响应事件
function getGameRecord(parseMsg,client){
	console.log("收到用户请求游戏记录："+parseMsg);
	UserDAO.getGameRecord(parseMsg,function(ret){
		console.log("找到游戏记录"+ret);
		//发送查询到的符合该用户的游戏记录
        client.send(JSON.stringify({"type_":"getGameRecord","record_":ret}));
	});
}
//循环所有在线登录客户端发送在线登录人数
function sendLoginNum(){
    //循环所有在线登录客户端发送在线登录人数
    for(var i=0;i<aLoginClient.length;i++){
      aLoginClient[i].client_.send(JSON.stringify({"type_":"loginNum","loginNum_":aLoginClient.length}));
    }
};
//发送最近20条聊天消息
function sendPastChat(client){
	UserDAO.getPastChat(function(ret){
   	    var Msg={
   	    	type_:"chat",
   	    	contex_:ret
   	    }		
        client.send(JSON.stringify(Msg));
	});
}
//随机生成障碍物坐标
function createZhangai(){
	var azhangai=[];
    for(var i=0;i<40;i++){
	    var bananan={
			banananX:Math.floor(Math.random()*(1600-800+1)+800),
			banananY:Math.floor(Math.random()*(420-270+1)+270),
		}
		var stone={
		    stoneX:Math.floor(Math.random()*(1600-800+1)+800),
	        stoneY:Math.floor(Math.random()*(420-270+1)+270),
	    }
	    var sand={
	    	sandX:Math.floor(Math.random()*(1600-800+1)+800),
	        sandY:Math.floor(Math.random()*(420-270+1)+270),
	    }
	    var coin={
	    	coinX:Math.floor(Math.random()*(1600-800+1)+800),
	        coinY:Math.floor(Math.random()*(420-270+1)+270),
	    }
	    var zhangai=[bananan,stone,sand,coin];
	    azhangai.push(zhangai);
    }
    matchClient.push(azhangai);
}
//获取服务器时间
function getServerTime(){
  var myDate=new Date();
  var nowTime=myDate.toLocaleString();
  return nowTime;
}