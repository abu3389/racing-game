//请求数据库模块服务
var sqlite=require("sqlite3");
//连接数据库
var db=new sqlite.Database("./db/yyjc.db",function(err){
  if(!err){
    console.log("越野机车数据库打开成功！");
  }else{
    console.log(err);
  }
});

//用户业务处理集成模块
function UserDAO(){
	//处理登录业务
	this.userLogin=function(parseMsg,callback){
		//查询账户密码是否有误
		db.all("select * from yyjc_all_user where user_name=? and user_pwd=?",[parseMsg.userName_,parseMsg.userPwd_],function(err,ret){
            if(ret.length!=0){
               console.log("数据库查找到用户信息：");
               console.log(ret);
               callback(ret);
            }else{
               console.log("数据库没有查找到用户信息");
               callback("noFind");
            }
		});
    }
	//处理注册业务
	this.userReg=function(parseMsg,callback){
		//账号查重
		db.all("select * from yyjc_all_user where user_name=?",[parseMsg.userName_],function(err,ret){
			if(ret.length!=0){
				console.log(ret);
                callback("exist");
			}else{
				//注册信息写入数据库
				db.run("insert into yyjc_all_user(user_name,user_pwd) values(?,?)",[parseMsg.userName_,parseMsg.userPwd_],function(err){
		            if(!err){
		            	callback("success");
		            }else{
		            	console.log(err);
		            	callback("faild");
		            }
	            });
			}
		});
	}
	//处理聊天业务
	this.userChat=function(parseMsg,callback){
		//聊天消息写入数据库
		db.run("insert into yyjc_chat_record(user_id,user_name,chat_content) values(?,?,?)",[parseMsg.userId_,parseMsg.userName_,parseMsg.chatMsg_],function(err){
            if(!err){
            	//获取前20条数据
            	db.all("select * from (select * from yyjc_chat_record order by chat_id desc limit 0,20) order by chat_id",function(err,ret){
            	    if(!err){
            	         callback(ret);
            	    }else{
            	    	console.log(err);
            	    }          		
            	});
            }else{
            	console.log(err);
            }			
		});
	}
	//处理获取最近20条聊天业务
	this.getPastChat=function(callback){
    	//获取前20条数据
    	db.all("select * from (select * from yyjc_chat_record order by chat_id desc limit 0,20) order by chat_id",function(err,ret){
    	    if(!err){
    	        callback(ret);
    	    }else{
    	    	console.log(err);
    	    }          		
    	});		
	}
    //处理第一名比赛结束记录存入业务
    this.setGameFirstEndRecord=function(parseMsg,callback1,callback2){
        //存入游戏记录
    	db.run("insert into yyjc_game_record(create_time,game_map,first_id,first_time,first_getgold,second_id) values(?,?,?,?,?,?)",[parseMsg.createTime_,parseMsg.gameMap_,parseMsg.userName_,parseMsg.gameTime_,parseMsg.gameGetGold_,parseMsg.parternerName_],function(err){
    		if(!err){
    			console.log("第一名玩家比赛记录存入成功！");
    	        callback1("success");
    	        //提取玩家信息
		    	db.all("SELECT user_gold,user_exp,user_level,user_power from yyjc_all_user WHERE user_name=?",[parseMsg.userName_],function(err,ret){
		            if(!err){
		            	 console.log("查找到第一名玩家数据："+ret);
		                 //玩家的金币增加
		                 var nowGold=Number(parseMsg.gameGetGold_);
		                 //玩家的经验增加
		                 var nowExp=Number(ret[0].user_exp)+Number(parseMsg.gameGetGold_)*0.5;
		                 //判断玩家等级，是否增加
		                 var nowLevel=Math.floor(Number(nowExp)/300);
		                 //玩家的战力增加
		                 var nowPower=Number(nowExp)*Math.floor(Number(nowLevel)/2);
		                 console.log(nowGold,ret[0].user_exp,ret[0].user_level,ret[0].user_power);
		                 //玩家信息修改数据库
		                 db.run("update yyjc_all_user set user_gold=?,user_exp=?,user_level=?,user_power=? where user_name=?",[nowGold,nowExp,nowLevel,nowPower,parseMsg.userName_],function(err){
		                    if(!err){
		                    	console.log("第一名玩家数据更新成功");
				                if(nowLevel>Number(ret[0].user_level)){
				                 	callback2(nowLevel);
				                }
		                    }else{
		                     	console.log(err);
		                    }
		                 });
		            }else{
		            	console.log(err);
		            }
		    	});   	
    	    }else{
    	    	console.log(err);
    	    }
    	});
    }
    //处理第二名比赛结束记录存入业务
    this.setGameSecondEndRecord=function(parseMsg,callback1,callback2){
    	db.run("update yyjc_game_record set second_getgold=? where create_time=?",[parseMsg.gameGetGold_,parseMsg.gameTime_],function(err){
    		if(!err){
    			console.log("第二名玩家比赛记录存入成功！");
    	        callback1("success");
    	        //提取玩家信息
		    	db.all("SELECT user_gold,user_exp,user_level,user_power from yyjc_all_user WHERE user_name=?",[parseMsg.userName_],function(err,ret){
		            if(!err){
		            	 console.log("查找到第二名玩家数据："+ret);
		                 //玩家的金币增加
		                 var nowGold=Number(ret[0].user_gold)+Number(parseMsg.gameGetGold_);
		                 //玩家的经验增加
		                 var nowExp=Math.floor(Number(ret[0].user_exp)+Number(parseMsg.gameGetGold_)*0.8);
		                 //判断玩家等级，是否增加
		                 var nowLevel=Math.floor(Number(nowExp)/300);
		                 //玩家的战力增加
		                 var nowPower=Number(nowExp)*Math.floor(Number(nowLevel)/2);
		                 //玩家信息修改数据库
		                 db.run("update yyjc_all_user set user_gold=?,user_exp=?,user_level=?,user_power=? where user_name=?",[nowGold,nowExp,nowLevel,nowPower,parseMsg.userName_],function(err){
		                    if(!err){
		                    	console.log("第二名玩家数据更新成功");
				                if(nowLevel>Number(ret[0].user_level)){
				                 	callback2(nowLevel);
				                }
		                    }else{
		                     	console.log(err);
		                    }
		                 });
		            }else{
		            	console.log(err);
		            }
		    	});    	         
    	    }else{
    	    	console.log(err);
    	    }
    	});
    }
    //处理获取玩家比赛记录业务
    this.getGameRecord=function(parseMsg,callback){
    	console.log(parseMsg);
    	db.all("select * from yyjc_game_record where first_id=? or second_id=?",[parseMsg.userName_,parseMsg.userName_],function(err,ret){
    		if(!err){
    			callback(ret);
    		}else{
                console.log(err);
    		}
    	})
    }
}

//设置该模块为外部引用
module.exports =new UserDAO();