  /**
   * 判断是否是mobile设备
   */
  function IsMobile() {
      var userAgentInfo = navigator.userAgent;
      var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod"];
      var flag = 0;
      for (var v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
              flag = 1;
              break;
          }
      }
      if (window.screen.width >= 768) {
          flag = 0;
      }
      return flag;
  }
 function  submitAjax() {
            $.ajax({
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/auto/login/",//传入后台的地址/方法
                 //jsonp: "callbackparam",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                 //jsonpCallback:"success_jsonpCallback",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                data:{
                    phone:$('#phone').val(),
                    password:$('#password').val(),
                    mobile:IsMobile()
                },//参数，这里是一个json语句
                success: function (data) {
                    var code = data.code;
                    var state = data.state;
                    var work_role = data.work_role;
                    // if (state===1) {
                    //     switch(work_role) {
                    //         case 32:
                    //              $("#user-role").text("系统管理员");;
                    //             break;
                    //         case 16:
                    //             window.userRole="加盟商管理员";
                    //             break;
                    //         case 8:
                    //             window.userRole="维护(安装)人员";
                    //             break;
                    //         case 4:
                    //             window.userRole="运营人员";
                    //             break;
                    //         default:
                    //             window.userRole="";
                    //             break;
                    //     }
                        location.href="/index.html";
                    }else {
                        alert("账号或密码错误!");
                    }
                },
                error: function (err) {
                    alert("err:" + err);
                }
            });
        }
$(function(){
    $("#submitBtn").click(function(){
        submitAjax();
    });
});
