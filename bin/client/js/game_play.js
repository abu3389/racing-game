//加载地图人物场景，启动游戏开始倒计时
function mapOnload(){
	//获取玩家信息
	  nowUser=JSON.parse(window.localStorage.getItem("HX170611_nowUser"))
    var gameCanvas =  document.getElementById("game_map");
    var ctx  = gameCanvas.getContext("2d");
    //加载地图
    var map = new Image();
    //加载摩托
    var motor=new Image();
    var parternerMotor=new Image();
    //加载人物
    var hold=new Image();
    var people=new Image();
    var parternerPeople=new Image();
    //加载障碍香蕉
    var bananan=new Image();
    //加载障碍石头
    var stone=new Image();
    //加载障碍沙地
    var sand=new Image();
    //加载道具金币
    var coin=new Image();
    //加载终点条
    var end=new Image();
    map.src = "./images/map2.jpg";
    motor.src='./images/Motor02.png';
    parternerMotor.src='./images/Motor02.png';
    hold.src='./images/hold.png';
    people.src='./images/c6s.png';
    parternerPeople.src='./images/c6s.png';
    bananan.src='./images/banana_2.png';
    stone.src="./images/bigstore.png";
    sand.src='./images/Sand1.png';
    coin.src='./images/Coin111.png';
    end.src='./images/end.png';
    //发送障碍物位置请求包
	ws.send(JSON.stringify({"type_":"getZhangAi","userName_":$("#player2").children().eq(0).text()}));
	map.onload=function(){
	  	//设置地图初始位置
	    ctx.drawImage(map,0,0,1280,768,0,0,800,480);//从图片的哪个位置开始，截取多少，放在画布哪个位置，大小多少//
	    //设置摩托初始位置
	    ctx.drawImage(motor,0,0,130,63,80,280,87,42);
	    //设置人物初始位置
	    ctx.drawImage(people,0,0,72,93,95,240,48,62);
	    //设置人物箭头初始位置
	    ctx.drawImage(hold,0,0,144,71,50,185,96,48);
	    //设置终点条的初始位置
	    ctx.drawImage(end,0,0,479,300,150,500,255,160);
	    //游戏倒计时定时器
		var daojishi=3;
		var daojishiTimmer=setInterval(function(){
		   $("#startTimeShow").text("倒计时"+daojishi--+"秒");
		   if(daojishi==-1){
		   	    $("#startTimeShow").text("GO!");
		   	    $("#startTimeShow").css({
                    "font-weight": "bold",
                    "left": "55%",
                    "top": "35%",
                    "font-size":"30px",
		   	    });
		   	    //安装游戏控制定时器
	            setGoTimmer(gameCanvas,ctx,map,motor,parternerMotor,hold,people,parternerPeople,bananan,stone,sand,coin,end);
	            //安装比赛开始计时器
	            setGameTimmer();
		   	    //倒计时结束清除定时器
		   	    clearInterval(daojishiTimmer);
		   	    return;
		   }
		},1000);
	}
}
var stoneX=500;
var stoneY=375;
var goTimmer;
//安装游戏控制定时器
function setGoTimmer(gameCanvas,ctx,map,motor,parternerMotor,hold,people,parternerPeople,bananan,stone,sand,coin,end){
    //设置按键默认标记
    var speedKeydown=false;
    var changeUpKeydown=false;
    var changeDownKeydown=false;
    $("body").keydown(function(e){
        var e = window.event ? window.event : e;
        var keyCode = e.which ? e.which : e.keyCode;
        //空格（加速）
        if(keyCode==32){
            speedKeydown=true;
        }
        //向上（向上移动赛道）
        if(keyCode==38){
            changeUpKeydown=true;
        }
        //向下（向下移动赛道）
        if(keyCode==40){
            changeDownKeydown=true;
        }
    });
    $("body").keyup(function(e){
        var e = window.event ? window.event : e;
        var keyCode = e.which ? e.which : e.keyCode;
        if(keyCode==32){
           speedKeydown=false;
        }
        if(keyCode==38){
           changeUpKeydown=false;
        }
        if(keyCode==40){
           changeDownKeydown=false;
        }
    });
    //创建定时器监控按键事件
    //初始化速度
    var distanceMapX=0;
    var speed=0;
    //初始化摩托车位置
    var motorStateX=0;//初始化摩托车状态
    var motorY=280;
    var motorX=80;
    //初始化障碍物位置
    //初始化香蕉障碍位置
    var banananX=600;
    var banananY=300;
    ctx.drawImage(bananan,0,0,64,64,banananX,banananY,43,43);//香蕉
    //初始化石头障碍位置
    ctx.drawImage(stone,0,0,512,265,stoneX,stoneY,68,35);//石头
    //初始化沙地障碍位置
    var sandX=320;
    var sandY=400;
    ctx.drawImage(sand,0,0,254,38,sandX,sandY,154,38);//沙地
    //初始化金币障碍位置
    var coinX=300;
    var coinY=350;
    var getCoin=0;
    var coinStatex=0;//初始化金币状态
    ctx.drawImage(coin,coinStatex,0,60,60,coinX,coinY,40,40);//金币  
    //游戏控制定时器
    goTimmer=setInterval(function(){
      //清除画布
      gameCanvas.height=480;
      //设置地图位置
      ctx.drawImage(map,distanceMapX,0,1280,768,0,0,800,480);//地图
      ctx.drawImage(bananan,0,0,64,64,banananX-43,banananY,43,43);//香蕉
      ctx.drawImage(stone,0,0,512,265,stoneX-68,stoneY,68,35);//石头
      ctx.drawImage(sand,0,0,254,38,sandX-154,sandY,154,38);//沙地
      ctx.drawImage(coin,coinStatex,0,60,60,coinX,coinY,40,40);//金币
      coinStatex+=60;
      if(coinStatex==1200){
        coinStatex=0;
      }
      //加速控制
      if(speedKeydown==true){
          distanceMapX+=speed;
          //地图终点判定
          if(distanceMapX>32000){
            distanceMapX=32000;
            motorX=80;
          }
          //设置碰撞物体位置
            banananX-=speed;
            stoneX-=speed;
            sandX-=speed;
            coinX-=speed; 
          //碰撞检测
          if(banananX-motorX-40>=0 && banananX-motorX-40<=87 && banananY-motorY>=0 && banananY-motorY<=42){
            console.log("踩到香蕉,速度："+speed);
            speed=1.2*speed;//香蕉加速20%
          }
          if(stoneX-motorX-70>=0 && stoneX-motorX-70<=87 && stoneY-motorY>=0 && stoneY-motorY<=35){
            console.log("往下撞到石头,速度"+speed);
            speed=-1;//石头立即停止
            console.log(stoneX-motorX);
          }
          if(sandX-motorX-150>=0 && sandX-motorX-150<=87 && sandY-motorY>=0 && sandY-motorY<=42){
            console.log("撞到沙地,速度："+speed);
            speed=0.7*speed;//沙地减速30%
          }
          if(coinX-motorX>=0 && coinX-motorX<=87 && coinY-motorY>=0 && coinY-motorY<=42){
            console.log(coinX-motorX);
            coin.src='./images/Coin222.png';//透明png替换
            if(getCoin==0){
              //获取金币框设置金币数值
                var coinNum=Number($("#goldShow").text());
                $("#goldShow").text(coinNum+1);
                //标记避免重复碰撞重复添加
                getCoin=1;
            }
            console.log("撞到金币,金币数："+$("#goldShow").text());
          }
          if(parternerMotorX-distanceMapX+80>=0 && parternerMotorX-distanceMapX+80<=87 && motorY-parternerMotorY>=0 && motorY-parternerMotorY<=42){
            console.log("撞到人物,速度："+speed);
            speed=0.5*speed;//撞到人物减速20%
          }
          //障碍物边界判定重新生成障碍物
          if(banananX<0){
             banananX=azhangaiPoint[start][0].banananX;
             banananY=azhangaiPoint[start][0].banananY;
             start++;
             if(start>39){
               start=0;
             }
          }
          if(stoneX<0){
             stoneX=azhangaiPoint[start][1].stoneX;
             stoneY=azhangaiPoint[start][1].stoneY;
             start++;
             if(start>39){
               start=0;
             }  
          }
          if(sandX<0){
             sandX=azhangaiPoint[start][2].sandX;
             sandY=azhangaiPoint[start][2].sandY;
             start++;
             if(start>39){
               start=0;
             }               
          }
          if(coinX<0){
             getCoin=0;
             coin.src='./images/Coin111.png';
             coinX=azhangaiPoint[start][3].coinX;
             coinY=azhangaiPoint[start][3].coinY;
             start++;
             if(start>39){
               start=0;
             }              
          }
          speed+=1;
          //最大速度判定
          if(speed>120){
            speed=120;
          }
          //设置终点条的位置
          ctx.drawImage(end,0,0,479,300,30000-distanceMapX,300,255,160); 
          //设置摩托状态和位置
          ctx.drawImage(motor,motorStateX,0,130,63,motorX,motorY,87,42);
          //设置人物位置
          ctx.drawImage(people,0,0,72,93,motorX+15,motorY-40,48,62);
          //设置人物箭头位置
          ctx.drawImage(hold,0,0,144,71,motorX-30,motorY-95,96,48);
          motorStateX+=130;
          //摩托状态边界判断
          if(motorStateX==1560){
            motorStateX=0;
          }
          //移动上控制
          if(changeUpKeydown==true){
              //设置摩托状态和位置
              ctx.drawImage(motor,motorStateX,0,130,63,motorX,motorY,87,42);
              //设置人物位置
              ctx.drawImage(people,0,0,72,93,motorX+15,motorY-40,48,62);
              //设置人物箭头位置
              ctx.drawImage(hold,0,0,144,71,motorX-30,motorY-95,96,48);
              motorY-=15;
              //边界判断
              if(motorY<270){
                motorY=270;
              }
          }
          //移动下控制
          if(changeDownKeydown==true){
            ctx.drawImage(motor,motorStateX,0,130,63,motorX,motorY,87,42);
            //设置人物位置
            ctx.drawImage(people,0,0,72,93,motorX+15,motorY-40,48,62);
            //设置人物箭头位置
            ctx.drawImage(hold,0,0,144,71,motorX-30,motorY-95,96,48);
            motorY+=15;
            //边界判断
            if(motorY>420){
              motorY=420;
            }         
          }                                        
      }
      //减速控制
      if(speedKeydown==false){
          distanceMapX+=speed;
          //设置碰撞物体位置
          banananX-=speed;
            stoneX-=speed;
            sandX-=speed;
            coinX-=speed;    
          //碰撞检测
          if(banananX-motorX-40>=0 && banananX-motorX-40<=87 && banananY-motorY>=0 && banananY-motorY<=42){
            console.log("踩到香蕉,速度："+speed);
            speed=1.2*speed;//香蕉加速20%
          }
          if(stoneX-motorX-80>=0 && stoneX-motorX-60<=95 && stoneY-motorY>=0 && stoneY-motorY<=35){
            console.log("往下撞到石头,速度"+speed);
            speed=-1;//石头立即停止
            console.log(stoneX-motorX);
            // if(stoneX-motorX-130<0){
            //  motorY=stoneY-42;
            //  console.log("往下撞到石头回弹，速度"+speed);
            // }
          }
          if(sandX-motorX-150>=0 && sandX-motorX-150<=87 && sandY-motorY>=0 && sandY-motorY<=42){
            console.log("撞到沙地,速度："+speed);
            speed=0.7*speed;//沙地减速30%
          }
          if(coinX-motorX>=0 && coinX-motorX<=87 && coinY-motorY>=0 && coinY-motorY<=42){
              console.log(coinX-motorX);
              console.log("撞到金币,金币数："+$("#goldShow").text());
              coin.src='./images/Coin222.png';//透明png替换
              if(getCoin==0){
                //获取金币框设置金币数值
                  var coinNum=Number($("#goldShow").text());
                  $("#goldShow").text(coinNum+1);
                  //标记避免重复碰撞重复添加
                  getCoin=1;
              }
          }
          if(parternerMotorX-distanceMapX+80>=0 && parternerMotorX-distanceMapX+80<=87 && motorY-parternerMotorY>=0 && motorY-parternerMotorY<=42){
                console.log("撞到人物,速度："+speed);
            speed=0.5*speed;//撞到人物减速20%
          }
          speed-=10;
          //判断最小速度
          if(speed<0){
            speed=0;
            motorStateX=0;//车轮停止
          }
          //设置摩托状态和位置
          ctx.drawImage(motor,motorStateX,0,130,63,motorX,motorY,87,42);
          //设置人物位置
          ctx.drawImage(people,0,0,72,93,motorX+15,motorY-40,48,62);
          //设置人物箭头位置
          ctx.drawImage(hold,0,0,144,71,motorX-30,motorY-95,96,48);
          motorStateX+=130;
          //边界判断
          if(motorStateX==1560){
            motorStateX=0;
          }     
      }
      //实时显示速度计
      $("#speedShow").css("width",speed/120*100+"%");
      //显示对手
      //设置对手摩托状态和位置
      ctx.drawImage(parternerMotor,parternermotorStateX,0,130,63,parternerMotorX-distanceMapX+80,parternerMotorY,87,42);
      // //设置对手人物位置
      ctx.drawImage(parternerPeople,0,0,72,93,parternerMotorX-distanceMapX+15+80,parternerMotorY-40,48,62); 
      //名次判断
      if(distanceMapX-parternerMotorX>=0){
        $("#paimingShow").css({
          "background-image":"url('./images/1.png')"
        })
      }else{
        $("#paimingShow").css({
          "background-image":"url('./images/2.png')"
        })
      }
      //向服务器发送自己的位置坐标
      ws.send(JSON.stringify({
        "type_":"gamePoint",
        "userName_":nowUser[0].user_name,
        "point_":[distanceMapX,motorY,motorStateX],
        "toUserName_":$("#player2").children().eq(0).text()
      }));
      //终点判断
      if((30000-distanceMapX)<=0){
          speed=0;
          // console.log("11111111111111111111111111111");
          //游戏结束结算事件
          gameEndEvent(); 
          //设置按键默认标记
          speedKeydown=false;
          changeUpKeydown=false;
          changeDownKeydown=false;
      }              
    },70);
    console.log("start:"+goTimmer);
}
//游戏结束结算事件
function gameEndEvent(){
  console.log("end:"+goTimmer);
  clearInterval(goTimmer);//清除游戏控制定时器
  clearInterval(gameTimmer);//清除比赛计时定时器
	//弹出结算窗体
  new showTabBox("55%","70%",["游戏结算"],[gameEndShowWinEvent]);	
	//获取比赛开始时间
	var gameCreateTime=JSON.parse(window.localStorage.getItem("HX170611_gameCreateTime"));
  //获取统计获得的游戏金币
  var goldTotall=$("#endBgDiv .goldTotallSpan").text().replace(/[^0-9]/ig, "");
  //获取对手信息
  var parternerInfo=JSON.parse(window.localStorage.getItem("HX170611_gamePartnerInfo"));
	//发送比赛结算信息
	ws.send(JSON.stringify({
		"type_":"gameFirstEnd",
		"userName_":nowUser[0].user_name,
		"userId_":nowUser[0].user_id,
		"parternerName_":parternerInfo.userName_,
		"parternerId_":parternerInfo.userId_,
		"createTime_":gameCreateTime,
		"gameMap_":"./images/map2.jpg",
		"gameTime_":$("#timeShow").text(),
		"gameGetGold_":goldTotall,
	}));
  console.log("发送第一名到达终点消息成功!");
}
//游戏结束弹窗事件
function gameEndShowWinEvent(obj){
   //获取本地存储用户信息
   var nowUser=JSON.parse(window.localStorage.getItem("HX170611_nowUser"));
   //创建比赛结果背景
   this.bgDiv=$("<div class='endBgDiv' id='endBgDiv'></div>");
   this.bgDiv.css({
     "height":"100%",
   	 "width":"100%",
   	 "background-size":"100% 100%",
   	 "position":"relative"
   });
   //判断是名次选择比赛结果背景图片
   if($("#paimingShow").css("backgroundImage").indexOf("1.png")!=-1){
   	    //成功的结算背景
        this.bgDiv.css("backgroundImage","url('./images/gamesuccess.jpg')");
   }else{
   	    //失败的结算背景
   	    this.bgDiv.css("backgroundImage","url('./images/gamefail.jpg')");
   }
   //创建金币显示区域
   this.goldShowDiv=$("<div class='goldShowDiv'></div>");
   this.goldShowDiv.css({
   	    "display":"inline-block",
        "position":"absolute",
        // "border":"1px solid red",
        "height":"23%",
        "width":"49%",
        "top":"24%",
        "right":"6%",
        "display":"table",
   });
   //创建原有金币
   this.oldGold=$("<p>");
   this.oldGold.text("原有金币："+nowUser[0].user_gold);
   //创建捡到的金币
   this.getGole=$("<p>");
   this.getGole.text("捡到金币："+$("#goldShow").text());
   //创建比赛奖励
   this.rewordGole=$("<p>");
   if($("#paimingShow").css("backgroundImage").indexOf("1.png")!=-1){
   	   this.rewordGole.text("比赛奖励:"+"100");
   }else{
   	   this.rewordGole.text("比赛奖励:"+"10");
   }
   this.goldShowSpan=$("<span class='goldShowSpan'></span>");
   this.goldShowSpan.css({
        "display":"table-cell",
        "vertical-align":"middle",
   });
   this.goldShowSpan.append(this.oldGold,this.getGole,this.rewordGole)
   this.goldShowDiv.append(this.goldShowSpan);
   this.goldShowDiv.find("p").css({
   	   "padding":"0% 10%",
   	   "text-align":"center",
   	   "color":"white",
   	   "font-size":"1.5vw",
   });
   //创建总计金币显示区域
   this.goldTotallDiv=$("<div class='goldTotallDiv'></div>");
   this.goldTotallDiv.css({
   	    "position":"absolute",
        // "border":"1px solid green",
        "height":"13%",
        "width":"47%",
        "top":"53%",
        "right":"7%",
        "display":"table",
        "text-align":"center",
   });
   this.goldTotallSpan=$("<span class='goldTotallSpan'></span>");
   this.goldTotallSpan.css({
        "display":"table-cell",
        "vertical-align":"middle",
        "font-size":"2vw"
   });
   var goldTotall=Number(this.oldGold.text().replace(/[^0-9]/ig, ""))+Number(this.getGole.text().replace(/[^0-9]/ig, ""))+Number(this.rewordGole.text().replace(/[^0-9]/ig, ""));
   this.goldTotallSpan.text("总计金币："+goldTotall);   
   //追加
   this.goldTotallDiv.append(this.goldTotallSpan);
   //创建比赛用时显示区域
   this.gameTimeDiv=$("<div class='gameTimeDiv'></div>");
   this.gameTimeDiv.css({
   	    "position":"absolute",
        // "border":"1px solid orange",
        "height":"8%",
        "width":"47%",
        "bottom":"24%",
        "right":"7%",
        "display":"table",
        "color":"white",
        "text-align":"center",   	    
   });
   this.gameTimeSpan=$("<div class='gameTimeSpan'></div>");
   this.gameTimeSpan.css({
        "display":"table-cell",
        "vertical-align":"middle",
        "font-size":"1.5vw",
   });
   this.gameTimeSpan.text("所用时长："+$("#timeShow").text()+"秒");
   //追加
   this.gameTimeDiv.append(this.gameTimeSpan);
   //创建再战一次按钮
   this.reStartBtn=$("<div class='reStartBtn'></div>");
   this.reStartBtn.css({
   	   	"display":"inline-block",
   	    "position":"absolute",
        // "border":"1px solid blue",
        "height":"11%",
        "width":"29%",
        "bottom":"7%",
        "right":"35%",
        "cursor":"pointer",
   });
   //安装再来一局点击事件
   this.reStartBtn.on("click",function(){
   	  //写入本地存储，刷新后用来判断，有则模拟点击开始游戏
      window.localStorage.setItem("HX170611_gameContinue","1");
      window.location.reload();//刷新页面
   });
   //创建返回大厅按钮
   this.comeBackBtn=$("<div class='comeBackBtn'></div>");
   this.comeBackBtn.css({
   	   	"display":"inline-block",
   	    "position":"absolute",
        // "border":"1px solid pink",
        "height":"11%",
        "width":"30%",
        "bottom":"7%",
        "right":"4%",
        "cursor":"pointer",
   });
   //安装返回大厅点击事件
   this.comeBackBtn.on("click",function(){
   	   window.location.reload();//刷新页面
   });
   //追加入结算背景
   this.bgDiv.append(this.goldShowDiv,this.goldTotallDiv,this.gameTimeDiv,this.reStartBtn,this.comeBackBtn);
   //清空窗体内容
   obj.oTabContent.html("");
   //窗体内容追加结算背景
   obj.oTabContent.append(this.bgDiv);
}
//安装比赛计时的定时器
var gameTimmer;
function setGameTimmer(){
	var ss=0//毫秒
    var s=0//秒
	//比赛计时器
	gameTimmer=setInterval(function(){
        ss++;
        if(ss==100){
        	s++;
        	ss=0;
        }
        $("#timeShow").text(s+"."+ss);
	},10);
}