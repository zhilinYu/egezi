//全局变量
//var image_id_list;//image ID
var nums = 10; //每页出现的数据量
var page = 0; //用于保存当前页
var page_count = 0;
var statusArr = ["", "正常", "注销"];
//请求后台数据并动态加载指定页数（getpage）列表list，每页最多显示5条
function loadList(getpage) {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/auto/user_list/",
        async: false,
        data: {       	
        	work_role: $("#work_role_search").val(),
        	page: getpage,
			per_page_count: nums //每页限定的数据
        },
        success: function(res) {
            var code = res.code;
            var data = res.data;
            page = data.page; //当前页 , 0 表示第一页
            page_count = data.page_count; //总页数
            if (code === 0 && (data.user_list.length != 0)) {
                itemArr = eval(data.user_list);
                var row = '';
                for (var i = 0; i < itemArr.length; i++) {
                    var tmpRole = "";
                    switch (itemArr[i].work_role) {
                        case 32:
                            tmpRole = "系统管理员";
                            break;
                        case 16:
                            tmpRole = "加盟商管理员";
                            break;
                        case 14:
                            tmpRole = "平台管理员";
                            break;
                        case 12:
                            tmpRole = "平台运营人员";
                            break; 
                        case 10:
                            tmpRole = "平台维护人员";
                            break;
                        case 8:
                            tmpRole = "第三方管理人员";
                            break;
                        case 6:
                            tmpRole = "第三方运营人员";
                            break;
                        default:
                            tmpRole = "其他人员";
                            break;
                    }
                    $("#list tr").remove();
                    row += '<tr id="item">';
                    row += '<td id="number">' + (i + 1 + page * nums) + '</td>';
                    //row += '<td id="merchant_number">' + itemArr[i].merchant_number + '</td>';
                    row += '<td id="job_member">' + itemArr[i].job_member + '</td>';
                    row += '<td id="name">' + itemArr[i].name + '</td>';
                    row += '<td id="work_role">' + tmpRole + '</td>';
                    row += '<td id="region">' + getPositionByCode(itemArr[i].region) + '</td>';
                    row += '<input type="hidden" id="region_code_hide" value="' + itemArr[i].region + '">';
                    row += '<td id="phone">' + itemArr[i].phone + '</td>';
                    row += '<td id="qq">' + itemArr[i].qq + '</td>';
                    row += '<td id="work_content">' + itemArr[i].work_content + '</td>';
                    //row += '<td id="device_number">' + itemArr[i].device_number + '</td>';
                    row += '<td id="status" class="status">' + statusArr[itemArr[i].status] + '</td>';
                    row += '<td id="register_date">' + new Date(parseInt(itemArr[i].register_date)*1000).toLocaleDateString() + '</td>';
                    row += '<td id="handle"><div class="button-group button-group-little"> <button class="button border-main editBtn" onclick="getItemVal($(this))"><span class="icon-edit"></span> 修改</button> <button class="button border-red" onclick="delSubmit($(this));"><span class="icon-lock"></span> 注销</button><a href="javascript:void(0)" class="button border-green" onclick="EnableSubmit($(this));"><span class="icon-unlock"></span> 激活</a><button class="button border-yellow" onclick="resetPassword($(this));"><span class="icon-refresh"></span> 重置密码</button> </div></td>';
                    row += '</tr>';
                    
                }                
                $("#list").append(row); 
                //设置注销状态下按钮的状态颜色 
                $(".status").each(function(){
                	if($(this).text() === "注销"){
                		$(this).parent().find("#handle button").attr("disabled",true);
                		$(this).parent().find("#handle button").css("color","gray");
                		$(this).parent().find("#handle button").css("border-color","gray");
                	}
                }); 
                $("#cur_page").text(page + 1);
    			$("#page_count").text(page_count);            
            } else {
                $("#list tr").remove();
            }
        },
        error: function(err) {
            alert("加载失败！");
        }
    });

}


//注销
function delSubmit(obj) {
	var data = JSON.stringify({
		job_member: String(obj.parent().parent().parent().find("#job_member").text()),
		name: String(obj.parent().parent().parent().find("#name").text()),
		phone: String(obj.parent().parent().parent().find("#phone").text()),
		qq: String(obj.parent().parent().parent().find("#qq").text()),
		work_content: String(obj.parent().parent().parent().find("#work_content").text()),
		status: 2
	});
	if(confirm("您确定要注销吗?")) {
		$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			url: "/auto/user_info/", //传入后台的地址/方法
			data: data, //参数，这里是一个json语句
			success: function(res) {
				var code = res.code;
				var data = res.data;
				var message = res.message;
				if(code == 0) {
					if(data.state == 0) {
						alert("注销成功！");
		                loadList(page);		                
						obj.parent().parent().parent().find("#handle a").each(function(){
							$(this).attr("disabled",true);
						});
					} else if(data.state == 1) {
						alert("此工号不存在！");
					} else {
						alert("注销失败！");
					}
				} else {
					alert("参数错误");
				}
			},
			error: function(err) {
				alert("注销失败！");
			}
		});
	};
}
//激活
function EnableSubmit(obj) {
	var data = JSON.stringify({
		job_member: String(obj.parent().parent().parent().find("#job_member").text()),
		name: String(obj.parent().parent().parent().find("#name").text()),
		phone: String(obj.parent().parent().parent().find("#phone").text()),
		qq: String(obj.parent().parent().parent().find("#qq").text()),
		work_content: String(obj.parent().parent().parent().find("#work_content").text()),
		status: 1
	});
	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		url: "/auto/user_info/", //传入后台的地址/方法
		data: data, //参数，这里是一个json语句
		success: function(res) {
			var code = res.code;
			var data = res.data;
			var message = res.message;
			if(code == 0) {
				if(data.state == 0) {
					alert("激活成功！");
					loadList(page);
				} else if(data.state == 1) {
					alert("此工号不存在！");
				} else {
					alert("激活失败！");
				}
			} else {
				alert("参数错误！");
			}
		},
		error: function(err) {
			alert("激活失败！");
		}
	});
}
//重置密码
function resetPassword(obj) {
	var data = JSON.stringify({
		job_member: String(obj.parent().parent().parent().find("#job_member").text())
	});
	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		url: "/auto/reset_password/", //传入后台的地址/方法
		data: data, //参数，这里是一个json语句
		success: function(res) {
			var code = res.code;
			var data = res.data;
			var message = res.message;
			if(code == 0) {
				if(data.state == 0) {
					alert("操作成功！");
					loadList(page);
				} else if(data.state == 1) {
					alert("此工号不存在！");
				} else {
					alert("操作失败！");
				}
			} else {
				alert("参数错误！");
			}
		},
		error: function(err) {
			alert("操作失败！");
		}
	});
}
//修改提交
function editSubmit() {
	var data = JSON.stringify({
        job_member: String($('input[name=job_member]').val()),
		name: String($('input[name=name]').val()),
        phone: String($('input[name=phone]').val()),
        qq: String($('input[name=qq]').val()),
        work_content: String($('input[name=work_content]').val()),
        status: 1
	});
	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		url: "/auto/user_info/", //传入后台的地址/方法
		data: data, //参数，这里是一个json语句
		success: function(res) {
			var code = res.code;
			var data = res.data;
			var message = res.message;
			if(code == 0) {
				if(data.state == 0) {
					alert("修改成功！");
					loadList(page);
				} else if(data.state == 1) {
					alert("此工号不存在！");
				} else {
					alert("修改失败！");
				}
			} else {
				alert("参数错误！");
			}
		},
		error: function(err) {
			alert("修改失败！");
		}
	});
}
//新增提交表单
function addSubmit() {
    //将数据序列化为json字符串
	var data = JSON.stringify({
	 	name: String($('input[name=name]').val()),
        work_role: Number($('select[name=work_role]').val()),
        region: String($('#district :selected').attr("data-code")),
        phone: String($('input[name=phone]').val()),
        qq: String($('input[name=qq]').val()),
        work_content: String($('input[name=work_content]').val())
	});
	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		url: "/auto/add_user/", //传入后台的地址/方法
		data: data, //参数，这里是一个json语句
		success: function(res) {
			var code = res.code;
			var data = res.data;
			var message = res.message;
			if(code == 0) {
				if(data.state == 0) {
					alert("添加成功！");
					loadList(page);
				} else if(data.state == 1) {
					alert("此手机号已经存在！");
				} else {
					alert("添加失败！");
				}
			} else {
				alert("参数错误！");
			}
		},
		error: function(err) {
			alert("添加失败！");
		}
	});
}
//弹出修改窗口 todo == 1表示修改，todo == 0表示新增
function addOrEdit(todo) {
		layui.use('layer', function() {
		var layer = layui.layer;
		layer.open({
			type: 1,
			title: todo ? "修改" : "新增",
			area: ['700px', '500px'],
			content: $("#editBox"),
			//btnAlign: 'c',
			// yes: function() {
			// 	 if (todo) {
   //                  editSubmit();
   //              } else {
   //                  addSubmit();
   //              }
			// 	layer.closeAll();
			// 	loadList(page);
			// 	$("#editBox").css("display","none");
			// 	location.href="/people.html";
			// },
			// btn2:function(){
			// 	layer.closeAll();
			// 	$("#editBox").css("display","none");
			// 	location.href="/people.html";
			// },
			success: function(layero, index) {
                //设置提交和取消按钮函数
                $("#submitBtn").click(function() {
                    $("#ajaxForm").ajaxSubmit(function() {
                    	if (($('#seachprov').val() == 0 || $('#seachcity').val() == 0 || $('#seachdistrict').val() == 0) && todo == 0) {
                    		alert("请选择地区！");
                    		return;
                    	}
                        if (todo) {
                            editSubmit();
                        } else {
                            addSubmit();
                        }
                        layer.closeAll();
                        $("#editBox").css("display", "none");
                        location.href = "/people.html";
                        loadList(page);
                    });

                });
                $("#cancalBtn").click(function() {
                    layer.closeAll();
                    $("#editBox").css("display", "none");
                    location.href = "/people.html";
                   
                });
            },
			cancel: function(){
               layer.closeAll();
               $("#editBox").css("display", "none");
               location.href = "/people.html";
            }
		});
	});
}

//获取当前操作项的值 然后弹出修改窗口
function getItemVal(obj){
		$('input[name=name]').val(obj.parent().parent().parent().find("#name").text());
	    $('input[name=job_member]').val(obj.parent().parent().parent().find("#job_member").text());
	    var tmpRole1 = 0;
	    switch (obj.parent().parent().parent().find("#work_role").text()) {
	        case "系统管理员":
	            tmpRole1 = 32;
	            break;
	        case "加盟商管理员":
	            tmpRole1 = 16;
	            break;
	        case "平台管理员":
	            tmpRole1 = 14;
	            break;
	        case "平台运营人员":
	            tmpRole1 = 12;
	            break;
	        case "平台维护人员":
	            tmpRole1 = 10;
	            break; 
	        case "第三方管理人员":
	            tmpRole1 = 8;
	            break; 
	        case "第三方运营人员":
	            tmpRole1 = 6;
	            break;  
	        default:
	            tmpRole1 = "";
	            break;
	    }
	    $('select[name=work_role]').val(tmpRole1);
	    $('select[name=work_role]').prop("disabled",true);
	   
		var tmpRegion_code = obj.parent().parent().parent().find("#region_code_hide").val();
		distpickerPositionByCode(tmpRegion_code);	
		$("#regionArea select").each(function(){
			$(this).prop("disabled",true);
		});	
	    $('input[name=phone]').val(obj.parent().parent().parent().find("#phone").text());
	    $('input[name=qq]').val(obj.parent().parent().parent().find("#qq").text());
	    $('input[name=work_content]').val(obj.parent().parent().parent().find("#work_content").text());
	    addOrEdit(1);	
}

$(function() {
	//阻止表单默认提交
    var submitBtn = document.getElementById("submitBtn");
    submitBtn.onclick = function (event) {
      var event = event || window.event;
      event.preventDefault(); // 兼容标准浏览器
      window.event.returnValue = false; // 兼容IE6~8
    };

    //默认加载第一页
    loadList(0);
    //设置分页
    $("#prev").click(function(){
     var prevPage = (page-1) < 0 ? 0 : page-1;
     loadList(prevPage);
    });
    $("#next").click(function(){
     var nextPage = (page+1) >= page_count ? page_count-1 : page+1;
     loadList(nextPage);
    });

});
