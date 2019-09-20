//给文本框安装聚焦,失焦,键盘弹起事件
textFocusEvent("reg_div");
//为注册按钮安装点击事件
regBtnEvent();
//为快速注册安装点击事件
loginLinkEvent();
/**
 * [给文本框安装聚焦,失焦,键盘弹起事件]
 * @param  {[string]} obj [包含文本框的模块对象的id]
 * @return {[type]}     [description]
 */
function textFocusEvent(obj){
	//获取所有需要安装的文本框
	var aTxt=$("#"+obj+" input");
  aTxt.bind({
  	//聚焦事件
   	focus:function(){
   	  //正则方法选取和校验
      checkEvent(this);
   	},
   	//失焦事件
    blur:function(){
      //正则方法选取和校验
      checkEvent(this);            
      },
    //键盘弹起事件
    keyup:function(){
      //正则方法选取和校验
      checkEvent(this);
    }
  })
}

/**
 * [正则校验]
 * @param  {[object]} obj [文本框对象]
 * @return {[type]}     [description]
 */
function checkTxT(obj,reg){
   //获取结果提示对象
  var info=$(obj).next();
  var mark=0;
  for(var i=0;i<reg.length;i++){
    if($(obj).val().match(reg[i])){
      mark+=1;
    }
  }
  if(mark==reg.length){
    //清除原来的提示图片背景样式
    info.removeClass("info");
    //显示当前的提示图片背景样式
    info.addClass("ok");
    info.text("正确");
  }else{
    //清除原来的提示图片背景样式
    info.removeClass("ok");
    //显示当前的提示图片背景样式
    info.addClass("info");
    if(obj.getAttribute("name")=="name"){
      info.text("请输入昵称");
    }
    if(obj.getAttribute("name")=="password"){
      info.text("请输入密码");
    }
  }
}
/**
 * [正则方法选取和校验]
 * @param  {[object]} obj [文本框对象]
 * @return {[type]}     [description]
 */
function checkEvent(obj){
    //判断是什么文本框需要用哪个正则验证
    //昵称验证
    if(obj.getAttribute("name")=="name"){
    	//校验合法性（不能包括空格、长度为4-8个字符、任意字符组合(包含中文、英文、数字、特殊符号)）
        checkTxT(obj,[/^\S+$/,/^[\w\u4e00-\u9fa5]{5,8}$/]);
    }
    //密码验证
    if(obj.getAttribute("name")=="password"){
    	//校验合法性（不能包括空格、长度为8-16个字符、必须包含字母、数字、符号中至少2种）
        checkTxT(obj,[/^\S+$/,/^[a-zA-Z]\w{7,15}$/,/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{7,15}$/]);
    }
}

//为注册按钮安装点击事件
function regBtnEvent(){
  $("#reg_btn").on("click",function(){
      var aSpan=$("#reg_div .info");
      var mark=0;
      //循环标记正确的输入选项
      aSpan.each(function(index,item){
        if($(item).css("color")=="green"){
          mark+=1;
        }
      });
      //判断是否全部正确
      if(mark==aSpan.length){
        //获取昵称
        var userName=$("#user_reg_name").val();
        //获取密码
        var userPwd=$("#user_reg_pwd").val();
        ws.send(JSON.stringify(new regMsg("regist",userName,userPwd)));
      }else{
        new showMsgBox(500,300,"注册失败！","请检查输入合法性!",function(){});
      }
  });  
}

//为快速注册安装点击事件
function loginLinkEvent(){
  $("#loginLink").on("click",function(){
    $("#login_div").show();
    $("#reg_div").hide();
  });
}
/**
 * [客户端注册信息发送包]
 * @param  {[string]} type     [包类型]
 * @param  {[string]} userName [用户昵称]
 * @param  {[string]} userPwd  [用户密码]
 * @return {[type]}          [description]
 */
function regMsg(type,userName,userPwd){
  this.type_=type;
  this.userName_=userName;
  this.userPwd_=userPwd;
}