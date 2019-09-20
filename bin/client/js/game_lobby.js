//安装查看用户详细信息点击事件
lookInfoBtnEvent();
//安装设置功能点击事件
funSetBtnEvent();
//安装关于我们功能点击事件
userAboutBtnEvent();
//安装聊天功能点击事件
gameChatEvent();
//创建聊天窗体
createChatBox("lobbyChatBox");
//安装开始游戏功能点击事件
startGameEvent();
//安装查看用户详细信息点击事件
function lookInfoBtnEvent(){
	$("#lookInfoBtn").on("click",function(){
         new showTabBox("55%","70%",["玩家信息","游戏记录"],[userInfoTabEvent,gameRecordTabEvent]);
	});
}
/**
 * [玩家信息选项卡点击事件]
 * @param  {[object]} obj [当前的窗体对象]
 * @return {[type]}     [description]
 */
function userInfoTabEvent(obj){
   var nowUser=JSON.parse(window.localStorage.getItem("HX170611_nowUser"));
   //创建玩家头像
   this.userHead=$("<img src='"+nowUser[0].user_head+"'>");
   this.userHead.css({
      "position":"absolute",
      "width":"25%",
      "height":"45%",
      "top":"50%",
      "left":"0",
      "marginTop":"-15%",
      "marginLeft":"7%",
      "border-radius":"5%"
   });
   //创建玩家详细数据DIV
   this.userInfoDetailDiv=$("<div id='userInfoDetailDiv'></div>");
   this.userInfoDetailDiv.css({
      // "border":"1px solid red",
      "width":"50%",
      "height":"80%",
      "position":"absolute",
      "right":"0",
      "top":"0",
      "marginTop":"3%",
      "marginRight":"10%",
      "paddingTop": "5%"
   });
   //创建玩家注册时间
   this.userRegTime=$("<div class='infoDetail'>注册时间：<br/>"+nowUser[0].reg_time+"</div>");
   this.userRegTime.css({
      "position":"absolute",
      "bottom": "20%",
      "left": "7%",
      "font-size": "1.3vw"
   });
   //创建玩家昵称
   this.userName=$("<p>昵称："+nowUser[0].user_name+"<br/>ID："+nowUser[0].user_id+"</p>");
   //创建玩家等级
   this.userLevel=$("<p>等级："+nowUser[0].user_level+"</p>");
   //创建玩家金币
   this.userGold=$("<p>金币："+nowUser[0].user_gold+"</p>");
   //创建玩家战力
   this.userPower=$("<p class='infoDetail'>战力："+nowUser[0].user_power+"</p>");
   //创建玩家经验
   this.userExp=$("<p class='infoDetail'>经验："+nowUser[0].user_exp+"</p>");
   this.userInfoDetailDiv.append(this.userName,this.userLevel,this.userGold,this.userPower,this.userExp);
   this.userInfoDetailDiv.find("p").css({
      "font-size":"2vw",
      "font-weight":"bold",
      "padding": "2% 0",
      // "border-bottom":"3px solid blue"
   });
   obj.oTabContent.html("");
	obj.oTabContent.append(this.userHead,this.userRegTime,this.userInfoDetailDiv);
}
/**
 * [游戏记录选项卡点击事件]
 * @param  {[object]} obj [当前的窗体对象]
 * @return {[type]}     [description]
 */
function gameRecordTabEvent(obj){
   //创建游戏记录显示div
   this.showRecordDiv=$("<div class='showRecordDiv' id='showRecordDiv'></div>");
   this.showRecordDiv.css({
      "height":"100%",
      "width":"100%",
      "overflow-x":"hidden",
      "overflow-y":"auto",
      // "border":"1px solid red"
   });
   //追加到窗体
   obj.oTabContent.html("");
	obj.oTabContent.append(this.showRecordDiv);
   //获取本地存储用户信息
   var nowUser=JSON.parse(window.localStorage.getItem("HX170611_nowUser"));
   //发送游戏记录请求
   ws.send(JSON.stringify({
      "type_":"getGameRecord",
      "userName_":nowUser[0].user_name,
   }));
}

//安装设置功能点击事件
function funSetBtnEvent(){
	$("#funSet").on("click",function(){
		new showTabBox("55%","70%",["游戏设置"],[setTabEvent]);
	});
}

/**
 * [设置选项卡点击事件]
 * @param  {[object]} obj [当前的窗体对象]
 * @return {[type]}     [description]
 */
function setTabEvent(obj){
   var item=this;
   /////////////////////////创建背景音乐调节DIV模块////////////////
   this.bgMusicDiv=$("<div class='bgMusicDiv' id='bgMusicDiv'></div>");
   this.bgMusicDiv.css({
   	"text-align":"center"
   });
   //背景音乐标题
   this.bgMusicTitle=$("<p>背景音乐</p>");
   this.bgMusicTitle.css({
   	"font-size":"2vw",
   	"font-weight":"bold"
   });
   //背景音乐调节按钮
   this.bgMusicContent=$("<div></div>");
   //获取音乐标签当前音量的属性值
   var nowVoice= $("#bg_music").attr("volume");
   //音量大小滑动条
   this.bgMusicBar=$("<input type='range' id='bgMusicRange' value='"+Number(nowVoice)*100+"'>");
   this.bgMusicBar.css({
	  "width":"50%",
	  "height":"2vw",
      "margin":"5% 0",
      "cursor":"pointer"
   });
   //音量数值显示位置
   this.bgVoiceNum=$("<label id='bgVoiceNum'>"+Number(nowVoice)*100+"%</label>");
   //音量开关按钮
   this.bgMusicCheck=$("<input type='checkBox' name='bgMusicCheck' id='bgMusicCheck' checked='true'></input>");
   this.bgMusicCheck.css({
   	"width":"5%",
      "height":"2vw",
      "cursor":"pointer",
      "position":"absolute",
      "margin-top": "5.5%"
   });
   //开关按钮文字
   this.bgMusicCheckInfo=$("<label name='bgMusicCheck'>开/关</label>");
   this.bgMusicCheckInfo.css({
      "font-size":"2vw",
      "height":"2vw",
      "margin": "5% 0px",
      "cursor":"pointer",
      "marginLeft":"2%"
   });
   this.bgMusicCheckInfo.append(this.bgMusicCheck);
   this.bgMusicContent.append(this.bgMusicBar,this.bgVoiceNum,this.bgMusicCheckInfo);
   this.bgMusicDiv.append(this.bgMusicTitle,this.bgMusicContent);
   //安装音量滑动条事件
   this.bgMusicBar.mousemove(function(){
      //获取当前用户滑动的数值
      var nowVoice=item.bgMusicBar.val();
      //设置音量数值显示
      $("#bgVoiceNum").text(nowVoice+"%");
      //设置音乐标签的音量属性
      $("#bg_music").attr("volume",nowVoice/100);//JQ对象不起作用
      $("#bg_music")[0].volume=nowVoice/100;
   });
   //安装音量开关事件
   this.bgMusicCheck.on("click",function(){
      var check= item.bgMusicCheck.prop("checked");
      if(check==true){
         //设置关闭
         $("#bg_music").get(0).play();
         item.bgMusicCheck.attr("checked","false");
      }else{
         if(check==false){
            $("#bg_music").get(0).pause();
            item.bgMusicCheck.attr("checked","true");
         }
      }
   });
   /////////////////////////创建游戏音效调节DIV模块////////////////
   this.gameMusicDiv=$("<div class='gameMusicDiv' id='gameMusicDiv'></div>");
   this.gameMusicDiv.css({
      "text-align":"center"
   });
   //游戏音效标题
   this.gameMusicTitle=$("<p>游戏音效</p>");
   this.gameMusicTitle.css({
      "font-size":"2vw",
      "font-weight":"bold"
   });
   //游戏音效调节按钮
   this.gameMusicContent=$("<div></div>");
   //获取音乐标签当前音量的属性值
   var nowGameVoice= $("#bg_music").attr("volume");
   //音量大小滑动条
   this.gameMusicBar=$("<input type='range' id='gameMusicBar' value='"+Number(nowGameVoice)*100+"'>");
   this.gameMusicBar.css({
     "width":"50%",
     "height":"2vw",
      "margin":"5% 0",
      "cursor":"pointer"
   });
   //音量数值显示位置
   this.gameVoiceNum=$("<label id='gameVoiceNum'>"+Number(nowGameVoice)*100+"%</label>");
   //音量开关按钮
   this.gameMusicCheck=$("<input type='checkBox' name='gameMusicCheck' id='gameMusicCheck' checked='true'></input>");
   this.gameMusicCheck.css({
      "width":"5%",
      "height":"2vw",
      "cursor":"pointer",
      "position":"absolute",
      "margin-top": "5.5%"
   });
   //开关按钮文字
   this.gameMusicCheckInfo=$("<label name='gameMusicCheck'>开/关</label>");
   this.gameMusicCheckInfo.css({
      "font-size":"2vw",
      "height":"2vw",
      "margin": "5% 0px",
      "cursor":"pointer",
      "marginLeft":"2%"
   });
   this.gameMusicCheckInfo.append(this.gameMusicCheck);
   this.gameMusicContent.append(this.gameMusicBar,this.gameVoiceNum,this.gameMusicCheckInfo);
   this.gameMusicDiv.append(this.gameMusicTitle,this.gameMusicContent);
   ///////////////////创建注销按钮模块/////////////////
   this.exitBtn=$("<span class='exitBtn' id='exitBtn'></span>");
   this.exitBtn.css({
      "display":"inline-block",
      "height":"25%",
      "width":"17%",
      "background":"url('./images/loginOut.png') no-repeat",
      "backgroundSize": "100% 100%",
      "position":"absolute",
      "bottom":"0",
      "right":"0",
      "marginRight":"5%",
      "marginBottom":"5%",
      "cursor":"pointer"
   });
   //追加
   obj.oTabContent.html("");
   obj.oTabContent.append(this.bgMusicDiv,this.gameMusicDiv,this.exitBtn);
   //安装音量滑动条事件
   this.gameMusicBar.mousemove(function(){
      //获取当前用户滑动的数值
      var nowVoice=item.gameMusicBar.val();
      //设置音量数值显示
      $("#gameVoiceNum").text(nowVoice+"%");
      //设置音乐标签的音量属性
      $("#bg_music").attr("volume",nowVoice/100);//JQ对象不起作用
      $("#bg_music")[0].volume=nowVoice/100;
   });
   //安装音量开关事件
   this.gameMusicCheck.on("click",function(){
      var check= item.gameMusicCheck.prop("checked");
      if(check==true){
         //设置关闭
         $("#bg_music").get(0).play();
         item.gameMusicCheck.attr("checked","false");
      }else{
         if(check==false){
            $("#bg_music").get(0).pause();
            item.gameMusicCheck.attr("checked","true");
         }
      }
   });
   ///////////////////安装注销按钮事件/////////////////
   this.exitBtn.on("click",function(){
      //删除服务端登录用户数组
      reduceLoginClient();
      //清除本地存储当前用户数据
      window.localStorage.removeItem("HX170611_nowUser");
      //刷新页面
      window.location.reload();
   });
}

//安装关于功能点击事件
function userAboutBtnEvent(){
	$("#userAbout").on("click",function(){
		new showTabBox("55%","70%",["游戏玩法","关于作者"],[howPlayTabEvent,aboutUsEvent]);
	});
}

/**
 * [游戏玩法选项卡点击事件]
 * @param  {[object]} obj [当前的窗体对象]
 * @return {[type]}     [description]
 */
function howPlayTabEvent(obj){
   this.img=$("<img src='./images/howPlay.jpg'>");
   this.img.css({
   	 "height":"100%",
   	 "width":"100%"
   });
   obj.oTabContent.html("");
   obj.oTabContent.append(this.img);
}
/**
 * [关于我们选项卡点击事件]
 * @param  {[object]} obj [当前的窗体对象]
 * @return {[type]}     [description]
 */
function aboutUsEvent(obj){
   this.img=$("<img src='./images/aboutAuthor.jpg'>");
   this.img.css({
   	 "height":"100%",
   	 "width":"100%"
   });
   obj.oTabContent.html("");
   obj.oTabContent.append(this.img);
}


//安装聊天功能点击事件
function gameChatEvent(){
   $("#funChat").on("click",function(){
      showHideDiv("lobbyChatBox");
      //获取聊天内容显示框
      var showChatMsg=$("#lobbyChatBox .chatContentDiv");
      //设置滚动条位置最底
      showChatMsg.scrollTop(99999);
   });
}

//安装开始游戏点击事件
function startGameEvent(){
   $("#userStartGame").on("click",function(){
      //获取本地存储数据
      var nowUser=JSON.parse(window.localStorage.getItem("HX170611_nowUser"));
      //隐藏游戏大厅
      $("#game_lobby").hide();
      //显示玩家头像
      $("#waitingPlayer1 .playerHead").css("background-image","url("+nowUser[0].user_head+")");
      //显示玩家昵称
      $("#player1").children().eq(0).text(nowUser[0].user_name);
      //显示玩家等级
      $("#player1").children().eq(1).text("LV."+nowUser[0].user_level);
      //显示游戏等待
      $("#game_waiting").show();
      //创建游戏匹配请求包
      var msgBag={
         type_:"match",
         userName_:nowUser[0].user_name,
         userHead_:nowUser[0].user_head,
         userLevel_:nowUser[0].user_level,
         userId_:nowUser[0].user_id,
      }
      //发送游戏匹配请求
      ws.send(JSON.stringify(msgBag));
   });
}