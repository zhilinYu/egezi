//全局变量
var nums = 10; //每页出现的数据量
var page = 0; //用于保存当前页
var page_count = 0;
var statusArr = ["已处理", "未处理", "全部"];
var newDate = new Date();
//请求后台数据并动态加载指定页数（getpage）列表list，每页最多显示5条
function loadList(getpage) {
	$.ajax({
		type: "GET",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		url: "/auto/intent_merchant_list/",
		async: false,
		data: {
			page: getpage,
			per_page_count: nums //每页限定的数据
		},
		success: function(res) {
			var code = res.code;
			var data = res.data;
			var register_date = data.register_date;
			page = data.page; //当前页 , 0 表示第一页
			page_count = data.page_count; //总页数
			if(code === 0 && (data.merchant_list.length != 0)) {
				itemArr = eval(data.merchant_list);
				var row = '';
				for(var i = 0; i < itemArr.length; i++) {
					$("#list tr").remove();
					row += '<tr id="item">';
					//row += '<td id="number">' + (i + 1) + '</td>';
					row += '<td id="_id">' + itemArr[i]._id + '</td>';
					row += '<td id="merchant_name">' + itemArr[i].merchant_name + '</td>';
					row += '<td id="merchant_linker">' + itemArr[i].merchant_linker + '</td>';
					row += '<td id="merchant_linker_phone">' + itemArr[i].merchant_linker_phone + '</td>';
					row += '<td id="wechat_account">' + itemArr[i].wechat_account + '</td>';
					row += '<td id="email">' + itemArr[i].email + '</td>';
					row += '<td id="content">' + itemArr[i].content + '</td>';
					row += '<td id="status" class="status">' + statusArr[itemArr[i].status] + '</td>';
					row += '<td id="register_date">' + newDate.toLocaleDateString(register_date) + '</td>';
					row += '<td id="handle"><div class="button-group button-group-small"> <button class="button border-main editBtn" onclick="getItemVal($(this))"><span class="icon-edit"></span> 修改</button> <button class="button border-green" onclick="doSubmit($(this));"><span class="icon-hand-o-up"></span> 处理</button></div></td>';
					row += '</tr>';
				}
				$("#list").append(row);
				$("#cur_page").text(page+1);
				$("#page_count").text(page_count);
				$(".status").each(function(){
                    if($(this).text() === "已处理"){
                        $(this).parent().find("#handle button").attr("disabled",true);
                        $(this).parent().find("#handle button").css("color","gray");
                        $(this).parent().find("#handle button").css("border-color","gray");
                    }
                });
			} else {
				$("#list tr").remove();
			}
		},
		error: function(err) {
			alert("加载失败！");
		}
	});

}

//处理
function doSubmit(obj) {
	var data = JSON.stringify({
		_id: String(obj.parent().parent().parent().find("#_id").text()),
		merchant_name: String(obj.parent().parent().parent().find("#merchant_name").text()),
		merchant_linker: String(obj.parent().parent().parent().find("#merchant_linker").text()),
		merchant_linker_phone: String(obj.parent().parent().parent().find("#merchant_linker_phone").text()),
		wechat_account: String(obj.parent().parent().parent().find("#wechat_account").text()),
		email: String(obj.parent().parent().parent().find("#email").text()),
		content: String(obj.parent().parent().parent().find("#content").text()),
		status: 0
	});
		$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			url: "/auto/modify_intent_merchant/", //传入后台的地址/方法
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
						alert("此ID不存在！");
					} else {
						alert("操作失败！");
					}
				} else {
					alert("参数错误");
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
		_id: String($('input[name=_id]').val()),
		merchant_name: String($('input[name=merchant_name]').val()),
		merchant_linker: String($('input[name=merchant_linker]').val()),
		merchant_linker_phone: String($('input[name=merchant_linker_phone]').val()),
		wechat_account: String($('input[name=wechat_account]').val()),
		email: String($('input[name=email]').val()),
		content: String($('textarea[name=content]').val()),
		status: 1
	});
	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		url: "/auto/modify_intent_merchant/", //传入后台的地址/方法
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
					alert("此ID不存在！");
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
		merchant_name: String($('input[name=merchant_name]').val()),
		merchant_linker: String($('input[name=merchant_linker]').val()),
		merchant_linker_phone: String($('input[name=merchant_linker_phone]').val()),
		wechat_account: String($('input[name=wechat_account]').val()),
		email: String($('input[name=email]').val()),
		content: String($('textarea[name=content]').val())
	});
	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		url: "/auto/add_intent_merchant/", //传入后台的地址/方法
		data: data, //参数，这里是一个json语句
		success: function(res) {
			var code = res.code;
			var data = res.data;
			var message = res.message;
			if(code == 0) {
				if(data.state == 0) {
					alert("添加成功！");
					loadList(page);
				}else {
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
//弹出修改窗口 todo = 1表示修改，todo = 0表示新增
function addOrEdit(todo) {
	layui.use('layer', function() {
		var layer = layui.layer;
		layer.open({
			type: 1,
			title: todo ? "修改" : "新增",
			area: ['700px', '500px'],
			content: $("#editBox"),
			success: function(layero, index) {
                //设置提交和取消按钮函数
                $("#submitBtn").click(function() {
                    $("#ajaxForm").ajaxSubmit(function() {
                        if (todo) {
                            editSubmit();
                        } else {
                            addSubmit();
                        }
                        layer.closeAll();
                        $("#editBox").css("display", "none");
                        location.href = "/intentionList.html";
                        loadList(page);
                    });

                });
                $("#cancalBtn").click(function() {
                    layer.closeAll();
                    $("#editBox").css("display", "none");
                });
            },
			cancel: function() {
				layer.closeAll();
				$("#editBox").css("display", "none");
			}
		});
	});
}
//获取当前操作项的值 然后弹出修改窗口
function getItemVal(obj){
	$('input[name=_id]').val(obj.parent().parent().parent().find("#_id").text());
	$('input[name=merchant_name]').val(obj.parent().parent().parent().find("#merchant_name").text());
	$('input[name=merchant_linker]').val(obj.parent().parent().parent().find("#merchant_linker").text());
	$('input[name=merchant_linker_phone]').val(obj.parent().parent().parent().find("#merchant_linker_phone").text());
	$('input[name=wechat_account]').val(obj.parent().parent().parent().find("#wechat_account").text());
	$('input[name=email]').val(obj.parent().parent().parent().find("#email").text());
	$('textarea[name=content]').val(obj.parent().parent().parent().find("#content").text());
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
