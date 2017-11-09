//全局变量
//var image_id_list;//image ID
var nums = 5; //每页出现的数据量
var page = 0; //用于保存当前页
var page_count = 0;
var statusArr = ["", "正常", "注销"];
//请求后台数据并动态加载指定页数（getpage）列表list，每页最多显示5条
function loadList(getpage) {
	var data = {
        	merchant_account: getcookie("thisAccount"),
        	work_role: 6,
        	page: getpage,
			per_page_count: nums //每页限定的数据
    };
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/auto/user_list/",
        async: false,
        data: data,
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
                    row += '<td id="number">' + (i + 1) + '</td>';
                    row += '<td id="merchant_account">' + itemArr[i].merchant_account + '</td>';
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
                    //row += '<td id="handle"><div class="button-group button-group-little"> <button class="button border-main editBtn" onclick="getItemVal($(this))"><span class="icon-edit"></span> 修改</button> <button class="button border-red" onclick="delSubmit($(this));"><span class="icon-lock"></span> 注销</button><a href="javascript:void(0)" class="button border-green" onclick="EnableSubmit($(this));"><span class="icon-unlock"></span> 激活</a><button class="button border-yellow" onclick="resetPassword($(this));"><span class="icon-refresh"></span> 重置密码</button> </div></td>';
                    row += '</tr>';

                }
                $("#list").append(row);
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


$(function() {
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
