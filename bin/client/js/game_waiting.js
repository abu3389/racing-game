cancelMatchEvent()
//安装取消匹配点击事件
function cancelMatchEvent(){
   $("#cancelBtn").on("click",function(){
      //显示游戏大厅
      $("#game_lobby").show();
      //隐藏游戏等待
      $("#game_waiting").hide();
      //发送取消匹配请求
      deleteMatchClient();
   });
}