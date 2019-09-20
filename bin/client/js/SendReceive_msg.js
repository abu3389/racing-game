var parternerMotorX;
var parternerMotorY;
var parternermotorStateX;
var azhangaiPoint;
var start=0;
//获取用户信息
var nowUser=JSON.parse(window.localStorage.getItem("HX170611_nowUser"));
/**
 * [设置客户端收到消息时选择事件]
 * @param  {[object]} parseMsg [收到的消息包对象]
 * @return {[type]}          [description]
 */
function msgEventChoose(parseMsg){
    switch(parseMsg.type_){
        case "login":
        loginGetMessage(parseMsg);
        break;
        case "regist":
        regGetMessage(parseMsg);
        break;
        case "update":
        updateGetMessage(parseMsg);
        break;
        case "loginNum":
        loginNumGetMessage(parseMsg);
        break;
        case "chat":
        chatGetMessage(parseMsg);
        break;
        case "matchResult":
        matchResultGetMessage(parseMsg);
        break;
        case "matchCancel":
        matchCancelGetMessage(parseMsg);
        break;
        case "gamePoint":
        gamePointGetMessage(parseMsg);
        break;
        case "getZhangAi":
        getZhangAiGetMessage(parseMsg);
        break;
        case "gameEnd":
        getGameEndGetMessage(parseMsg);
        break;
        case "levelUp":
        levelUpGetMessage(parseMsg);
        break;
        case "getGameRecord":
        getGameRecord(parseMsg);
        break;
    }
}
//客户端接收注册返回消息响应事件
function regGetMessage(parseMsg){
	if(parseMsg.result_==1){
		new showMsgBox(500,300,"注册成功！","点击确定跳转登录...",function(){
			$("#reg_div").hide();
			$("#login_div").show();
		});
	}
	if(parseMsg.result_==0){
		new showMsgBox(500,300,"注册失败！","内部存储错误",function(){});
	}
	if(parseMsg.result_==2){
		new showMsgBox(500,300,"注册失败！","已存在该玩家！",function(){});
	}
}
//客户端接收登录返回消息响应事件
function loginGetMessage(parseMsg){
	if(parseMsg.result_==1){
		new showMsgBox(500,300,"登录成功！","即将进入游戏界面...",function(){
			//登录信息写入本地存储
            window.localStorage.setItem("HX170611_nowUser",JSON.stringify(parseMsg.contex_));
            //进入游戏大厅
            $("#login_reg").hide();
            $("#game_lobby").show();
            //显示用户信息
            showUserInfo();
		});
	}
	if(parseMsg.result_==0){
		new showMsgBox(500,300,"登录失败！","用户名或密码错误！",function(){});		
	}
}
//客户顿接收更新用户信息响应事件
function updateGetMessage(parseMsg){
	if(parseMsg.result_==1){
		//更新信息写入本地存储
        window.localStorage.setItem("HX170611_nowUser",JSON.stringify(parseMsg.contex_));
        //显示用户信息
        showUserInfo();
	}
}
//客户端接收在线登录用户人数信息响应事件
function loginNumGetMessage(parseMsg){
    //显示在线登录人数
    $("#lobbyChatBox .nowLoginNum").text("当前在线总人数："+parseMsg.loginNum_+"人");
}
//客户端接收聊天消息响应事件
function chatGetMessage(parseMsg){
	//获取聊天内容显示框
	var showChatMsg=$("#lobbyChatBox .chatContentDiv");
	//清空聊天内容
	showChatMsg.html("");
	//循环输出聊天消息
	$(parseMsg.contex_).each(function(index,item){
	    //创建消息基本框架
        var msgDiv=$("<div class='msgDiv'></div>");		
		$(item).each(function(pos,posItem){
	       //创建用户昵称
	       var userName=$("<span class='userName'>"+posItem.user_name+"</span>");
	       userName.css({
	       	"color":"orange"
	       });
	       //创建用户ID
	       var userId=$("<span class='userId'>( ID："+posItem.user_id+") </span>");
	       userId.css({
	       	"color":"orange"
	       });
	       //创建用户聊天时间
	       var userTime=$("<span class='userTime'>"+posItem.chat_time+" 说：</span>");
	       userTime.css({
	       	"color":"green"
	       });
	       //创建用户聊天消息
	       var userMsg=$("<br/><span class='userMsg'>"+posItem.chat_content+"</span>");
	       userMsg.css({
	       	"color":"white"
	       });
	       //追加
	       msgDiv.append(userName,userId,userTime,userMsg);
		});
		showChatMsg.html(showChatMsg.html()+msgDiv.html()+"<br/>");
	});
	//设置滚动条位置最底
    showChatMsg.scrollTop(99999);
}

//客户端接收匹配结果响应事件
var timmer;
function matchResultGetMessage(parseMsg){
	//获取本地存储用户信息
	var nowUser =JSON.parse(window.localStorage.getItem("HX170611_nowUser"));
	//循环玩家信息数组找到对手玩家信息
	$(parseMsg.contex_).each(function(index,item){
        if(item.userName_!=nowUser[0].user_name && $("#player2").children().eq(0).text()=="暂无玩家"){
        	//显示对手玩家头像
		    $("#waitingPlayer2 .playerHead").css("background-image","url("+item.userHead_+")");
		    //显示对手玩家昵称
		    $("#player2").children().eq(0).text(item.userName_);
		    //显示对手玩家等级
		    $("#player2").children().eq(1).text("LV."+item.userLevel_);
		    //匹配状态显示
		    $("#waitingPlayer1 .zhuangtai").text("匹配成功！等待进入游戏...");
		    $("#waitingPlayer2 .zhuangtai").text("匹配成功！等待进入游戏...");
		    //设置取消匹配按钮无效
		    $("#cancelBtn").unbind("click");
		    //54321倒计时进入游戏界面
		    var i=3;
		    timmer=setInterval(function(){
               $("#cancelBtnTxt").text("即将进入游戏...倒计时"+i--+"秒");
               if(i==-1){
               	    //隐藏游戏等待
               	    $("#game_waiting").hide();
               	    //显示游戏页面
               	    $("#game_playing").show();
                    //加载地图人物场景，启动游戏开始倒计时
               	    mapOnload();
               	    //倒计时结结束
               	    clearInterval(timmer);
               	    //存入游戏创建时间
               	    window.localStorage.setItem("HX170611_gameCreateTime",JSON.stringify(parseMsg.createTime_));
               	    //存入对手信息
               	    for(var m=0;m<parseMsg.contex_.length;m++){
               	    	//判断是否为自己的信息
	               	    if(parseMsg.contex_[m].userName_!=nowUser[0].user_name){
	               	    	//不是则存入本地存储
	                        window.localStorage.setItem("HX170611_gamePartnerInfo",JSON.stringify(parseMsg.contex_[m]));
	                        break;
	               	    }
               	    }
               	    return;
               }
		    },1000);		    
        }
	});
}
//客户端接收对手掉线响应事件
function matchCancelGetMessage(parseMsg){
	//匹配等待掉线的情况
	if($("#game_waiting").css("display")=="block"){
		//匹配状态显示
	    $("#waitingPlayer1 .zhuangtai").text("匹配中...");
	    $("#waitingPlayer2 .zhuangtai").text("玩家掉线！等待玩家加入...");
	    //清除对手玩家头像
	    $("#waitingPlayer2 .playerHead").css("background-image","url('./images/user_head1.jpg')");
	    //清除对手玩家昵称
	    $("#player2").children().eq(0).text("暂无玩家");
	    //清除对手玩家等级
	    $("#player2").children().eq(1).text("");
	    //显示取消匹配按钮
		$("#cancelBtn").show();
		//清除倒计时定时器
		clearInterval(timmer);
		$("#cancelBtnTxt").text("取消匹配")
		//安装取消匹配点击事件
		cancelMatchEvent();		
	}
	//游戏中对手掉线的情况
	if($("#game_playing").css("display")=="block"){
	    //发送取消匹配请求
        deleteMatchClient();
    	clearInterval(goTimmer);//清除游戏控制定时器
    	clearInterval(gameTimmer);//清除比赛计时定时器
        //游戏结束结算事件
        if($("#endBgDiv").length==0){
        	gameEndEvent();
        }
	}
}
//客户端接收对手坐标响应事件
function gamePointGetMessage(parseMsg){
   parternerMotorX=parseMsg.point_[0];
   // console.log(parternerMotorX);
   parternerMotorY=parseMsg.point_[1];
   // console.log(parternerMotorY);
   parternermotorStateX=parseMsg.point_[2];
}
//客户端接收障碍坐标响应事件
function getZhangAiGetMessage(parseMsg){
  azhangaiPoint=parseMsg.zhangai_;
}
//客户端接收游戏第二名正常结束响应事件
function getGameEndGetMessage(parseMsg){
    clearInterval(goTimmer);//清除游戏控制定时器
	clearInterval(gameTimmer);//清除比赛计时定时器
	//游戏结束结算事件
    if($("#endBgDiv").length==0){
    	//弹出结算窗体
        new showTabBox("55%","70%",["游戏结算"],[gameEndShowWinEvent]);
        //获取统计获得的游戏金币
        var goldTotall=$("#endBgDiv .goldTotallSpan").text().replace(/[^0-9]/ig, "");
    	//发送比赛结算信息
	    ws.send(JSON.stringify({
		"type_":"gameSecondEnd",
		"userName_":nowUser[0].user_name,
		"userId_":nowUser[0].user_id,
		"gameTime_":$("#timeShow").text(),
		"gameGetGold_":goldTotall,
	     }));
    }
}
//客户端接收等级提升消息响应事件
function levelUpGetMessage(parseMsg){
   //弹窗提示
   new showMsgBox(500,300,"等级提升为：LV."+parseMsg.nowLevel_,"恭喜，等级提升啦！",function(){});
}
//客户端接收游戏记录消息响应事件
function getGameRecord(parseMsg){
	console.log(parseMsg);
	var record=parseMsg.record_;
	for(var i=0;i<record.length;i++){
		//创建记录条
		var recordDiv=$("<div>");
		var recordBar=$("<div class='recordBar'></div>");
		recordBar.css({
			"padding":"2%",
			"text-align":"center",
			"border-bottom":"3px solid black"
		});
       	//创建比赛时间
		var startTime=$("<p>");
		startTime.text("比赛时间："+record[i].create_time);
		//创建第一名玩家记录
		var firstPlayer=$("<p>");
		firstPlayer.text("第一名："+record[i].first_id+" "+"所用时长："+record[i].first_time+"秒"+" "+"所得金币："+record[i].first_getgold);
		//创建第二名玩家记录
	    var secondPlayer=$("<p>");
		secondPlayer.text("第二名："+record[i].second_id+" "+"所用时长："+record[i].second_time+"秒"+"(未完成)"+" "+"所得金币："+record[i].second_getgold);
		//追加进记录条
		recordBar.append(startTime,firstPlayer,secondPlayer);
		recordDiv.append(recordBar);
		//获取当前窗口添加
		$("#showRecordDiv").html($("#showRecordDiv").html()+recordDiv.html());
	}
}
