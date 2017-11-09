//全局变量
var nums = 5; //每页出现的数据量
var page; //用于保存当前页
var page_count;
var statusArr = ["", "正常", "缺货","故障","停止"];
var apply_statusArr = ["","申请中","安装中","完成"];
var belongArr = ["","平台","","第三方商家"];
var device_typeArr = ["","小型","中型","大型","中型","","","","大型"];
var newDate = new Date();
var page = 0,page_count = 0;
//请求后台数据并动态加载指定页数（getpage）列表list，每页最多显示5条
function loadList(getpage) {
	$("#list tr").remove();
	var data = {
			merchant_account:String($('input[name=merchant_account_search]').val()),
			begin_time:(new Date("2016/06/1 08:00:00")).getTime()/1000,
			end_time:(new Date("2222/06/1 08:00:00")).getTime()/1000,
			apply_status:Number($('select[name=apply_status]').val()),
			page: getpage,
			per_page_count: nums //每页限定的数据
		};
	//data.merchant_account || delete data.merchant_account;
	$.ajax({
		type: "GET",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		url: "/auto/egezi_list/",
		async: false,
		data: data,
		success: function(res) {
			var code = res.code;
			var data = res.data;
			page = data.page; //当前页 , 0 表示第一页
			page_count = data.page_count; //总页数
			if(code === 0 && (data.device_list != [])) {
				itemArr = eval(data.device_list);
				var row = '';
				for(var i = 0; i < itemArr.length; i++) {
					
					row += '<tr id="item">';
					row += '<td id="number">' + (i + 1) + '</td>';
					row += '<td id="merchant_account">' + itemArr[i].merchant_account + '</td>';
					row += '<td id="merchant_name">' + itemArr[i].merchant_name + '</td>';
					row += '<td id="region_code">' + getPositionByCode(itemArr[i].address_info.region_code) + '</td>';
					row += '<input type="hidden" id="region_code_hide" value="' + itemArr[i].address_info.region_code + '"/>';
					row += '<td id="belong">' + belongArr[itemArr[i].belong] + '</td>';
					row += '<td id="device_type">' + device_typeArr[itemArr[i].device_type] + '</td>';
					row += '<td id="good_boxes">' + itemArr[i].good_boxes + '</td>';
					row += '<td id="detail_address">' + itemArr[i].address_info.detail_address + '</td>';
					row += '<td id="merchant_linker">' + itemArr[i].merchant_linker + '</td>';
					row += '<td id="merchant_linker_phone">' + itemArr[i].merchant_linker_phone + '</td>';
					row += '<td id="apply_time">' + new Date(parseInt(itemArr[i].apply_time)*1000).toLocaleDateString() + '</td>';
					row += '<td id="device_id">' + itemArr[i].device_id + '</td>';
					row += '<td id="maintainer">' + itemArr[i].maintainer + '</td>';
					row += '<td id="maintainer_phone">' + itemArr[i].maintainer_phone + '</td>';
					row += '<td id="operation">' + itemArr[i].operation + '</td>';
					row += '<td id="operation_phone">' + itemArr[i].operation_phone + '</td>';
					row += '<td id="pre_finish_time">' + new Date(parseInt(itemArr[i].pre_finish_time)*1000).toLocaleDateString() + '</td>';
					// row += '<td id="running_status">' + statusArr[itemArr[i].running_status] + '</td>';
					// row += '<td id="empty_boxes">' + itemArr[i].empty_boxes + '</td>';
					// row += '<td id="total_sale_money">' + itemArr[i].total_sale_money + '</td>';
					row += '<td id="apply_status">' + apply_statusArr[itemArr[i].apply_status] + '</td>';
					 row += '<td id="handle"><div class="button-group button-group-little" style="width:133px"> <a class="button border-main editBtn" href="javascript:void(0)" onclick="getItemVal($(this));"><span class="icon-edit"></span> 修改</a> <a class="button border-red" href="javascript:void(0)" onclick="download_QRcode($(this));"><span class="icon-lock"></span> 二维码下载</a></div></td>';
					row += '</tr>';
				}
				$("#list").append(row);
				$("#cur_page").text(page === undefined ? 0 : （page + 1）);
                $("#page_count").text(page_count === undefined ? 0 ： page_count);			
			} else {
				$("#list tr").remove();
			}
		},
		error: function(err) {
			alert("加载失败！");
		}
	});
	setcookie("merchant_account_dA",data.merchant_account,1440);
	setcookie("apply_status_dA",data.apply_status,1440);

}

//获取柜子编码
function getCode() {
	var data = {
		region_code:String($('#district :selected').attr("data-code"))
	};
		$.ajax({
			type: "GET",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			url: "/auto/egezi_id/",
			data: data,
			success: function(res) {
				var code = res.code;
				var data = res.data;
				var message = res.message;
				if(code == 0) {
					alert("获取成功！");
					$('input[name=device_id]').val(data.device_id);
				} else {
					alert("获取失败！");
				}
			},
			error: function(err) {
				alert("参数错误！");
			}
		});
}
//设备编号二维码下载
function download_QRcode(obj) {
	var data = {
		device_id:String(obj.parent().parent().parent().find("#device_id").text())
	};
	$.ajax({
		type: "GET",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		url: "/auto/device_qrcode/",
		data: data,
	});
	location.href = "/auto/device_qrcode/?device_id="+data.device_id+"";
}
//修改提交
function editSubmit() {
	var data = JSON.stringify({
		device_id: String($('input[name=device_id]').val()),
		device_type: Number($('select[name=device_type]').val()),
		good_boxes: Number($('input[name=good_boxes]').val()),
		address_info:{
			detail_address:String($('input[name=detail_address]').val()),
			region_code:String($('#district :selected').attr("data-code"))
		},
		merchant_linker: String($('input[name=merchant_linker]').val()),
		merchant_linker_phone: String($('input[name=merchant_linker_phone]').val()),
		maintainer: String($('select[name=maintainer] :selected').text()),
		maintainer_phone: String($('input[name=maintainer_phone]').val()),
		operation: String($('select[name=operation] :selected').text()),
		operation_phone: String($('input[name=operation_phone]').val()),
		pre_finish_time: parseInt((new Date($('input[name=pre_finish_time]').val())).getTime()/1000)
	});
	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		url: "/auto/modify_egezi/", //传入后台的地址/方法
		data: data, //参数，这里是一个json语句
		success: function(res) {
			var code = res.code;
			var data = res.data;
			var message = res.message;
			if(code == 0) {
				if(data.state == 0) {
					alert("修改成功！");
				} else if(data.state == 1) {
					alert("设备id不存在！");
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
		merchant_account: String($('input[name=merchant_account]').val()),
		belong: Number($('select[name=belong]').val()),
		device_type: Number($('select[name=device_type]').val()),
		good_boxes: Number($('input[name=good_boxes]').val()),
		address_info:{
			detail_address:String($('input[name=detail_address]').val()),
			region_code:String($('#district :selected').attr("data-code"))
		},
		merchant_linker: String($('input[name=merchant_linker]').val()),
		merchant_linker_phone: String($('input[name=merchant_linker_phone]').val()),
		device_id: String($('input[name=device_id]').val()),
		maintainer: String($('select[name=maintainer] :selected').text()),
		maintainer_phone: String($('input[name=maintainer_phone]').val()),
		operation: String($('select[name=operation] :selected').text()),
		operation_phone: String($('input[name=operation_phone]').val()),
		pre_finish_time: parseInt((new Date($('input[name=pre_finish_time]').val())).getTime()/1000)
	});
	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		url: "/auto/add_egezi/", //传入后台的地址/方法
		data: data, //参数，这里是一个json语句
		success: function(res) {
			var code = res.code;
			var data = res.data;
			var message = res.message;
			if(code == 0) {
				if(data.state == 0) {
					alert("添加成功！");
				} else if(data.state == 2) {
					alert("商家账号不存在！");
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
//弹出修改或新增窗口 todo = 1表示修改，todo = 0表示新增
function addOrEdit(todo) {
	getMaintainer();
	layui.use('layer', function() {
		var layer = layui.layer;
		layer.open({
			type: 1,
			title: todo ? "修改" : "新增",
			area: ['800px', '500px'],
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
                        location.href = "/deviceApply.html";
                        loadList(0);
                    });

                });
                $("#cancalBtn").click(function() {
                    layer.closeAll();
                    $("#editBox").css("display", "none");
                    location.href = "/deviceApply.html";
                });
            },
			cancel: function() {
				layer.closeAll();
				$("#editBox").css("display","none");
				location.href = "/deviceApply.html";
			}
		});
	});

}

//获取当前操作项的值 然后弹出修改窗口
function getItemVal(obj){
	addOrEdit(1);
	$('input[name=merchant_account]').val(obj.parent().parent().parent().find("#merchant_account").text());
	$("#btn_operation").trigger("click");
	$('input[name=merchant_name]').val(obj.parent().parent().parent().find("#merchant_name").text());
	var tmpRegion_code = obj.parent().parent().parent().find("#region_code_hide").val();
	distpickerPositionByCode(tmpRegion_code);
	$('select[name=belong]').val(belongArr.indexOf(obj.parent().parent().parent().find("#belong").text()));
	$('select[name=device_type]').val(device_typeArr.indexOf(obj.parent().parent().parent().find("#device_type").text()));
	$('input[name=good_boxes]').val(obj.parent().parent().parent().find("#good_boxes").text());
	$('input[name=detail_address]').val(obj.parent().parent().parent().find("#detail_address").text());
	$('input[name=merchant_linker]').val(obj.parent().parent().parent().find("#merchant_linker").text());
	$('input[name=merchant_linker_phone]').val(obj.parent().parent().parent().find("#merchant_linker_phone").text());
	$('input[name=device_id]').val(obj.parent().parent().parent().find("#device_id").text());
	$('select[name=maintainer]').val(Number(obj.parent().parent().parent().find("#maintainer_phone").text()));
	$('input[name=maintainer_phone]').val(obj.parent().parent().parent().find("#maintainer_phone").text());
	$('select[name=operation]').val(Number(obj.parent().parent().parent().find("#operation_phone").text()));
	$('input[name=operation_phone]').val(obj.parent().parent().parent().find("#operation_phone").text());
	$('input[name=pre_finish_time]').val(obj.parent().parent().parent().find("#pre_finish_time").text());
		$('input[name=device_id]').prop("disabled",true);
		$('input[name=merchant_account]').prop("disabled",true);
		$('select[name=belong]').prop("disabled",true);
	
}

//获取平台维护人员加载到下拉框
function getMaintainer(){
    $.ajax({
    	type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        url: "/auto/user_list/",
        data: {
        	work_role: 10,
        	page: 0,
			per_page_count: 999 //每页限定的数据
    	},
        success: function(res){
        	var code = res.code;
            var data = res.data;
            page = data.page; //当前页 , 0 表示第一页
            page_count = data.page_count; //总页数
            if (code === 0 && (data.user_list.length != 0)) {
                itemArr = eval(data.user_list);
                for (var i = 0; i < itemArr.length; i++) {
                	$("select[name=maintainer]").append("<option value='"+itemArr[i].phone+"'>"+itemArr[i].name+"</option>");
                }
            }
        }
    });
}

//获取第三方商家运营人员加载到下拉框
function getOperation(merchantAccount){
	$("select[name=operation]").empty();
	var data = {};
    if ($("#tmpType").val() == 1) {
    	data = {
        	merchant_account: merchantAccount,
        	work_role: 6,
        	page: 0,
			per_page_count: 999 
    	};	
    }else if($("#tmpType").val() == 2){
    	data = {
        	work_role: 12,
        	page: 0,
			per_page_count: 999 
    	};
    }else{
    	return;
    };
    $.ajax({
    	type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        url: "/auto/user_list/",
        data: data,
        success: function(res){
        	var code = res.code;
            var data = res.data;
            page = data.page; //当前页 , 0 表示第一页
            page_count = data.page_count; //总页数
            if (code === 0 && (data.user_list.length != 0)) {
                itemArr = eval(data.user_list);
                for (var i = 0; i < itemArr.length; i++) {
                	$("select[name=operation]").append("<option value='"+itemArr[i].phone+"'>"+itemArr[i].name+"</option>");
                }               
            }
        }
    });
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
	$("input[name=merchant_account]").blur(function(){
		var tmpVal = $(this).val();
		if (tmpVal == "") {
			return;
		}
		$.ajax({
	    	type: "GET",
	        contentType: "application/json; charset=utf-8",
	        dataType: "json",
	        url: "/auto/merchant_info_query/",
	        data: {
	        	merchant_account: String($(this).val())  	
	    	},
	        success: function(res){
	            var code = res.code;
	            var data = res.data;
	            if(!data){
	            	alert("商家账号不存在！")
	           		$("input[name=merchant_account]").val("").focus();	            	
	            }else{
	            	$("#tmpType").val(data.merchant_type);
	            }
	        }
    	});
	});
	$("input[name=maintainer_phone]").focus(function(){
		$(this).val($("select[name=maintainer]").val());
	});
	$("select[name=maintainer]").change(function(){
		$("input[name=maintainer_phone]").val($("select[name=maintainer]").val());
	});
	$("input[name=operation_phone]").focus(function(){
		$(this).val($("select[name=operation]").val());
	});
	$("select[name=operation]").change(function(){
		$("input[name=operation_phone]").val($("select[name=operation]").val());
	});
	$("#btn_operation").click(function(){
		getOperation($("input[name=merchant_account]").val());
	});
});
