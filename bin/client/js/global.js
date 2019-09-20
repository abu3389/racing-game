 //创建连接
 ws=new WebSocket("ws://127.0.0.1:5566");
 //等待连接
 ws.onopen=function(){
  //等待消息
  ws.onmessage=function(msg){
     var parseMsg=JSON.parse(msg.data);
     // console.log(parseMsg);
     msgEventChoose(parseMsg);
  }
  //检查是否有登陆用户
  loginCheck();
  //检查是否有继续游戏记录
  gameContinueCheck();
 }
//窗体卸载事件
window.onunload=function(){
  //删除登录客户端数组
  reduceLoginClient();
  //匹配掉线发送请求清空服务端的匹配数据
  deleteMatchClient();
}
/**
 * [创建信息提示框]
 * @param  {[number]} width    [弹窗的宽]
 * @param  {[number]} height   [弹窗的高]
 * @param  {[type]} title    [弹窗的标题]
 * @param  {[type]} body     [弹窗的内容（支持html）]
 * @param  {[type]} yesEvent [点击确定要执行的事件]
 * @param  {[type]} noEvent [点击取消要执行的事件]
 * @return {[type]}          [description]
 */
function showMsgBox(width,height,title,body,yesEvent,noEvent){
  //创建消息提示大框架
  this.oDiv=$("<div class='msgBox' id='msgBox'>");
   //设置大框架样式
  this.oDiv.css({
    // "min-height":height+"px",
    // "min-width":width+"px",
    "position":"absolute",
    "top":"50%",
    "left":"50%",
    "marginTop":"-"+height/2+"px",
    "marginLeft":"-"+(width/2+20)+"px",
    "backgroundColor":"#f3f3f3",
    "zIndex":"3000",
    "opacity":"0.9"
  });
  //创建关闭按钮
  this.oImgDiv=$("<div class='boxImg' id='boxImg'>");
  this.oImgDiv.css({
    "cursor":"move"
  });
  this.oImg=$("<img src='./images/close.png'>");
  this.oImg.css({
    "cursor":"pointer",
  });
  this.oImgDiv.append(this.oImg);
  //设置关闭按钮样式
  this.oImgDiv.css({
    "text-align":"right",
  });
  //创建文本内容
  this.oSpanDiv=$("<div class='boxContent' id='boxContent'>");
  this.oSpanTitle=$("<span>");
  this.oSpanBody=$("<span>");
  this.oSpanTitle.html(title);
  this.oSpanBody.html(body);
  this.oSpanDiv.append(this.oSpanTitle,this.oSpanBody);
  //设置文本内容样式
  this.oSpanDiv.css({
    "display":"inline-block",
    "padding":"0 20px",
    "width":width+"px",
    "word-wrap":"break-word"
  });
  this.oSpanTitle.css({
    "display":"block",
    "font-size":"25px",
    "text-align":"center",
    "color":"red"
  });
  this.oSpanBody.css({
    "font-size":"20px",
    "text-align":"left"
  });
  //创建确定取消按钮
  this.oButtonDiv=$("<div class='boxBtn' id='boxBtn'>");
  this.oBtnYes=$("<span class='oBtnYes yesNo' id='oBtnYes'>");
  this.oBtnYes.css("float","left");
  this.oBtnYes.text("确定");
  this.oBtnNo=$("<span class='oBtnNo yesNo' id='oBtnNo'>");
  this.oBtnNo.css("float","right");
  this.oBtnNo.text("取消");
  this.oButtonDiv.append(this.oBtnYes,this.oBtnNo);
  //追加进大的框架
  this.oDiv.append(this.oImgDiv,this.oSpanDiv,this.oButtonDiv);
  $("body").append(this.oDiv);
  //设置按钮样式
  $(".yesNo").css({
    "height":"40px",
    "line-height":"40px",
    "width":"240px",
    "color":"white",
    "background-color":"#09A3DC",
    "border-radius":"3px",
    "text-align":"center",
    "margin":"5px 10px",
    "cursor":"pointer",
    "display":"inline-block"
  });
  var item=this;
  //设置关闭按钮点击事件
  this.oImg.on("click",function(){
    item.oDiv.remove();
  });
  //设置确定按钮点击事件
    this.oBtnYes.on("click",function(){
    item.oDiv.remove();
     yesEvent();
  });
  //设置取消按钮点击事件
  this.oBtnNo.on("click",function(){
    item.oDiv.remove();
    noEvent();
  });
  //设置框架窗体拖动事件
  new divMoveEvent(this.oImgDiv,item);
}

/**
 * [设置框架窗体拖动事件]
 * @param  {[object]} setMoveJqObj [要设置移动事件的区域]
 * @param  {[objct]} MoveJqObj    [要设置移动的对象]
 * @return {[type]}              [description]
 */
function divMoveEvent(setMoveJqObj,MoveJqObj){
  var X,Y //定义两个坐标，用来获取鼠标距离窗体左上角的距离
  var mark=0; //设置一个标记，用来标记鼠标是否弹起
    setMoveJqObj.on({
    "mousedown":function(e){
      //标记此时鼠标还是按下
      mark=1;
      //获取鼠标距离窗体左上角的距离
      X=e.clientX-MoveJqObj.oDiv.offset().left; //鼠标距浏览器窗口X的距离-窗体距浏览器窗口X的距离
      Y=e.clientY-MoveJqObj.oDiv.offset().top;  //鼠标距浏览器窗口Y的距离-窗体距浏览器窗口Y的距离  
    },
    "mouseup":function(){
      //标记此时鼠标已经弹起
      mark=0;
    }
  });

    $("body").on("mousemove",function(e){
      //判断标记此时鼠标是按下还是弹起,按下就根据此时鼠标位置找到对应的窗体位置进行移动
      if(mark==1){
        //设置窗体的最新位置
        MoveJqObj.oDiv.css({
          "left":e.clientX-X,
          "top":e.clientY-Y,
          "margin":"0"
        });
      }
    });
}
/**
 * [创建信息选项卡窗口]
 * @param  {[number]} width    [选项卡窗口占页面百分比宽]
 * @param  {[number]} height   [选项卡窗口占页面百分比高]
 * @param  {[type]} aTab     [选项卡名称数组]
 * @return {[type]}          [description]
 */
function showTabBox(width,height,aTab,afun){
  var pos=this;
  //创建遮罩层
  this.oBg=$("<div class='TabBoxBg' id='TabBoxBg'></div>");
  this.oBg.css({
    "height":"100%",
    "width":"100%",
    "background-color":"black",
    "opacity":"0.8",
    "position":"absolute",
    "top":"0",
    "left":"0"
  });
  //创建信息选项卡窗口
  this.oDiv=$("<div class='TabBox' id='TabBox'>");
  //设置大框架样式
  this.oDiv.css({
    "min-width":width,
    "min-height":height,
    "position":"absolute",
    "top":"50%",
    "left":"50%",
    "backgroundColor":"#f3f3f3",
    "zIndex":"3000",
    "opacity":"0.9",
    "border-radius":"5%"
  });
  //创建选项卡Div
  this.tabDiv=$("<div class='tabDiv'></div>");
  this.tabDiv.css({
     // "border":"1px solid red",
     "width":"90%",
     "height":"10%",
     "padding":"0 5% 0 5%",
     "display":"inline-block",
     "position":"absolute",
     "marginTop":"-5%"
  });
  //循环选项卡名称数组创建选项卡
  $(aTab).each(function(index,item){
    //创建选项卡模板
    var oTab=$("<span class='oTab' name='"+item+"' id='oTab"+index+"'></span>");
    oTab.css({
      "border":"1px solid orange",
      "display":"inline-block",
      "width":"20%",
      "height":"100%",
      "text-align":"center",
      "line-height":"170%",
      "backgroundColor":"rgba(39,40,34,1)",
      "color":"white",
      "marginRight":"1%",
      "font-size":"1.5vw",
      "border-radius":"25% 25% 0 0",
      "padding-top":"1%",
      "vertical-align":"top",
      "cursor":"pointer",
      "padding":"0 2%",
    });
    oTab.text(item);
    pos.tabDiv.append(oTab);
  });
  //创建选项卡内容框
  this.oTabContent=$("<div class='oTabContent' id='oTabContent'></div>");
  this.oTabContent.css({
    "border":"1px solid #f3f3f3",
    "height":"86%",
    "width":"92%",
    "display":"inline-block",
    "position":"absolute",
    "marginTop":"1%",
    "margin":"2%",
    "padding":"2%",
    "border-radius":"5%",
    "box-shadow": "darkgrey 0px 0px 30px 5px inset"//边框内阴影
  });
  //创建返回按钮
  this.oBtnBack=$("<div class='oBtnBack' id='oBtnBack'></div>");
  this.oBtnBack.css({
     "display":"inline-block",
     "position":"absolute",
     "background":"url('./images/back_1.png') no-repeat",
     "backgroundSize":"100% 100%",
     "height":"12%",
     "width":"12%",
     "top":"0",
     "left":"0",
     "cursor":"pointer"
  });
  this.oDiv.append(this.tabDiv,this.oTabContent);
  $("body").append(this.oBg,this.oDiv,this.oBtnBack);
  //改变选项卡窗体位置使窗体居中
  changeTabBoxCenter();
  //为返回按钮安装点击事件
  this.oBtnBack.on("click",function(){
    pos.oBg.remove();//移除遮罩
    pos.oDiv.remove();//移除窗体
    pos.oBtnBack.remove();//移除返回按钮
  });
  //为选项卡安装点击事件
  this.aTab=this.tabDiv.find("span");
  this.aTab.each(function(index,item){
    //循环安装选项卡点击事件
      $(item).on("click",function(){
        //改变选项卡颜色
        changeTabColor(item);
        //设置要出现的玩家信息
        afun[index](pos);
      });                 
  });
  //默认设置显示第一个选项卡
  this.aTab[0].click(); 
}

/**
 * [选项卡切换，改变颜色]
 * @param  {[object]} obj [当前点击的选项卡对象]
 * @return {[type]}     [description]
 */
function changeTabColor(obj){
   //去除所有选项卡颜色
   $(obj).siblings().css({
      "color":"white"
   });
   //改变当前选项卡颜色
   $(obj).css({
      "color":"orange"
   });
}

//窗体发生变化事件
$(window).resize(function(){
   changeTabBoxCenter();
});

//改变选项卡窗体位置使窗体居中
function changeTabBoxCenter(){
  //获取DIV宽度、高度
  var divWidth=$("#TabBox").outerWidth();
  var divHeigth=$("#TabBox").outerHeight();
  //重新设置窗体位置
  $("#TabBox").css({
    "marginLeft":"-"+divWidth/2+"px",
    "marginTop":"-"+divHeigth/2+"px"
  });
}

//用于刷新时判断用户是否已经登录,已登录则显示用户，增加服务端的登录客户端数组
function loginCheck(){
  if(window.localStorage.getItem("HX170611_nowUser")){
    $("#login_reg").hide();
    $("#game_lobby").show();
    //更新用户信息
    userUpDate();
    //增加服务端的登录客户端数组
    addLoginClient();
  }else{
    $("#game_lobby").hide();
    $("#login_reg").show();
  }
}
//增加服务端的登录客户端数组
function addLoginClient(){
  var nowUser=JSON.parse(window.localStorage.getItem("HX170611_nowUser"));
  //发送增加客户端数组包
  ws.send(JSON.stringify({type_:"addLoginClient",userName_:nowUser[0].user_name}));
}
//减少服务端的登录客户端数组
function reduceLoginClient(){
  var nowUser=JSON.parse(window.localStorage.getItem("HX170611_nowUser"));
  //发送增加客户端数组包
  ws.send(JSON.stringify({type_:"reduceLoginClient",userName_:nowUser[0].user_name}));
}
//匹配掉线清空服务端的匹配数组
function deleteMatchClient(){
    var nowUser=JSON.parse(window.localStorage.getItem("HX170611_nowUser"));
    //发送增加客户端数组包
    ws.send(JSON.stringify({type_:"deleteMatchClient",userName_:nowUser[0].user_name}));
}
//显示用户信息
function showUserInfo(){
  //获取用户信息
  var nowUser=JSON.parse(window.localStorage.getItem("HX170611_nowUser"));
  //显示玩家昵称
  $("#userName").text("昵称："+nowUser[0].user_name);
  //显示玩家等级
  $("#levelNum").text("LV. "+nowUser[0].user_level);
  //显示玩家战力
  $("#userPower").text("战力："+nowUser[0].user_power);
  //显示金币数量
  $("#goldNum").text(nowUser[0].user_gold+"$");
}
//更新用户信息
function userUpDate(){
  //获取用户信息
  var nowUser=JSON.parse(window.localStorage.getItem("HX170611_nowUser"));
  //获取用户名称
  var userName=nowUser[0].user_name;
  //获取用户密码
  var userPwd=nowUser[0].user_pwd;
  ws.send(JSON.stringify(new loginMsg("update",userName,userPwd)));
}

/**
 * [创建聊天窗体]
 * @param  {[string]} boxID [窗体ID]
 * @param  {[string]} OnlineNumID [窗体在线人数ID]
 * @param  {[string]} closeBtnID [窗体关闭按钮ID]
 * @param  {[string]} ContentDivID [窗体中部内容ID]
 * @param  {[string]} EditTextID [窗体文字编辑框ID]
 * @param  {[string]} EditTextID [窗体发送按钮ID]
 * @return {[type]}       [description]
 */
function createChatBox(boxID){
   var item = this;
   //创建窗体大框架
   this.chatBoxDiv=$("<div class='chatBoxDiv' id='"+boxID+"'></div>");
   this.chatBoxDiv.css({
      // "border":"1px solid red",
      "height":"60%",
      "width":"40%",
      "position":"absolute",
      "bottom":"0",
      "left":"0",
      "marginBottom":"4.6%",
      "display":"none"
   });
   //创建窗体遮罩
   this.chatBgDiv=$("<div class='chatBgDiv'></div>");
   this.chatBgDiv.css({
      // "border":"1px solid red",
      "height":"100%",
      "width":"100%",
      "background-color":"black",
      "opacity":"0.8",
      "border-radius":"5%",
      "position":"absolute"
   });
   //创建头部框架
   this.chatHeadDiv=$("<div class='chatHeadDiv'></div>");
   this.chatHeadDiv.css({
      "height":"5%",
      "width":"94%",
      "padding":"2% 3%",
      // "border-bottom":"3px solid white",
   });
   //创建头部在线人数
   this.chatOnlineNum=$("<span class='nowLoginNum'>当前在线总人数：100人</span>");
   this.chatOnlineNum.css({
      "color":"white",
      "font-size":"1vw",
      "position":"absolute",
   });
   //创建关闭按钮
   this.chatCloseBtn=$("<div class='chatCloseBtn'><div>");
   this.chatCloseBtn.css({
       "height": "10%",
       "width": "9%",
       "position": "absolute",
       "right": "1%",
       "top": "1%",
       "background": "url('./images/close_1.png') no-repeat",
       "cursor":"pointer",
       "background-size":"100% 100%"
   });
   //创建中部聊天内容框架
   this.chatContentDiv=$("<div class='chatContentDiv'></div>");
   this.chatContentDiv.css({
      "height":"65%",
      "width":"94%",
      "padding":"2% 3%",
      "border-bottom":"3px solid #333333",
      "position":"absolute",
      "font-size":"1.5vw",
      "overflow-x":"hidden",
      "overflow-y":"auto",
      "word-wrap":"break-word"
   });
   //创建底部编辑内容框架
   this.chatFooterDiv=$("<div class='chatFooterDiv'></div>");
   this.chatFooterDiv.css({
      "height":"11%",
      "width":"94%",
      "padding":"2% 3%",
      // "border":"1px solid white",
      "position": "absolute",
      "bottom": "0",
   });
   //创建消息编辑框
   this.chatEditText=$("<input class='chatEditText' type='text' placeholder='说点什么吧...'>");
   this.chatEditText.css({
      "height":"35%",
      "width":"70%",
      "position":"absolute",
      "font-size":"1vw",
      "padding":"1% 2%",
      "marginTop":"1%"
   });
   //创建消息发送按钮
   this.chatSendBtn=$("<div class='chatSendBtn'>发送<div>");
   this.chatSendBtn.css({
      "line-height":"100%",
      "width":"15%",
      "position":"absolute",
      "font-size":"1vw",
      "border-radius":"5%",
      "background-color":"orange",
      "color":"white",
      "font-weight":"bold",
      "text-align":"center",
      "padding":"2.5% 0%",
      "cursor":"pointer",
      "right":"0",
      "marginRight":"3%",
      "marginTop":"1%"
   });
   this.chatSendBtn.on({
      "mousedown":function(){
         item.chatSendBtn.css({
            "background-color":"blue",
         });
      },
      "mouseup":function(){
         item.chatSendBtn.css({
            "background-color":"orange",
         });
      }
   });
   //追加
   this.chatHeadDiv.append(this.chatOnlineNum,this.chatCloseBtn);
   this.chatFooterDiv.append(this.chatEditText,this.chatSendBtn);
   this.chatBoxDiv.append(this.chatBgDiv,this.chatHeadDiv,this.chatContentDiv,this.chatFooterDiv);
   $("body").append(this.chatBoxDiv);
   //安装窗体关闭按钮事件
   this.chatCloseBtn.on("click",function(){
      item.chatBoxDiv.hide();
   });
   //安装窗体发送按钮事件
   this.chatSendBtn.on("click",function(){
      //获取输入文本框内容
      var msg=item.chatEditText.val();
      //获取当前登录玩家信息
      var nowUser=JSON.parse(window.localStorage.getItem("HX170611_nowUser"));
      //获取当前登录玩家昵称
      var userName=nowUser[0].user_name;
      //获取当前登录玩家ID
      var userId=nowUser[0].user_id;
      //发送聊天消息到服务器
      ws.send(JSON.stringify(new chatMsg("chat",userId,userName,msg)));
      //清空编辑框
      item.chatEditText.val("");
   });
};
/**
 * [显示或隐藏窗体]
 * @param  {[type]} divID [要显示隐藏的窗体ID]
 * @return {[type]}       [description]
 */
function showHideDiv(divID){
   //获取窗体的显示隐藏状态
   var action=$("#"+divID).css("display");
   if(action=="none"){
      $("#"+divID).slideToggle("slow",function(){
          $("#"+divID).show();
      });
   }else{
      if(action=="block"){
        $("#"+divID).slideToggle("slow",function(){
            $("#"+divID).hide();
        });
      }
   }
}
/**
 * [客户端登录信息发送包]
 * @param  {[string]} type     [包类型]
 * @param  {[string]} userName [用户昵称]
 * @param  {[string]} userPwd  [用户密码]
 * @return {[type]}          [description]
 */
function loginMsg(type,userName,userPwd){
  this.type_=type;
  this.userName_=userName;
  this.userPwd_=userPwd;
}
//客户端聊天内容发送包
function chatMsg(type,userId,userName,chatMsg){
  this.type_=type;
  this.userId_=userId;
  this.userName_=userName;
  this.chatMsg_=chatMsg;
}
//检查是否有继续游戏的指令，有则模拟点击开始游戏
function gameContinueCheck(){
  if(window.localStorage.getItem("HX170611_gameContinue")){
    //模拟点击开始游戏
    $("#userStartGame").trigger("click");
    //清除本地存储该记录
    window.localStorage.removeItem("HX170611_gameContinue");
  }
}
