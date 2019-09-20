//为登录按钮安装点击事件
loginBtnEvent();
//为快速注册安装点击事件
regLinkEvent();
//为快速注册安装点击事件
function regLinkEvent(){
	$("#regLink").on("click",function(){
		$("#reg_div").show();
		$("#login_div").hide();
	});	
}
//为登录按钮安装点击事件
function loginBtnEvent(){
    $("#login_btn").on("click",function(){
        //获取昵称
        var userName=$("#user_login_name").val();
        //获取密码
        var userPwd=$("#user_login_pwd").val();
        //判断是否为空
        if(userName=="" || userPwd==""){
           new showMsgBox(500,300,"提示","输入不能为空",function(){return});
        }else{
        	ws.send(JSON.stringify(new loginMsg("login",userName,userPwd)));
        }
    });
}