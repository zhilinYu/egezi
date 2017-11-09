//全局变量
var nums = 10; //每页出现的数据量
var page = 0; //用于保存当前页
var page_count = 0;
var statusArr = ["正常", "正常", "缺货", "故障","停止","柜子为空"];
var belongArr = ["","平台","","第三方商家"];
var device_typeArr = ["", "小型", "", "", "中型", "", "", "", "大型"];
var apply_statusArr = ["","申请中","安装中","完S成"];
var newDate = new Date();
var page = 0,page_count = 0;

//请求后台数据并动态加载指定页数（getpage）列表list
function loadList(getpage) {
    $("#list tr").remove();
    var getData = {
        merchant_account: String($('input[name=merchant_account]').val()),
        begin_time: (new Date($('#LAY_demorange_s').val())).getTime() / 1000 || Math.floor((newDate.getTime() - 15 * 24 * 60 * 60 *1000) / 1000),
        end_time: (new Date($('#LAY_demorange_e').val())).getTime() / 1000 || Math.ceil(newDate.getTime() / 1000),
        belong: $('select[name=belong]').val(),
        maintainer: String($('input[name=maintainer]').val()),
        operation: String($('input[name=operation]').val()),
        page: getpage,
        per_page_count: nums //每页限定的数据
    };
    getData.merchant_account || delete getData.merchant_account;
    getData.belong || delete getData.belong;
    getData.maintainer || delete getData.maintainer;
    getData.operation || delete getData.operation;
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/auto/egezi_list/",
        async: false,
        data: getData,
        success: function(res) {
            var code = res.code;
            var data = res.data;
            var totalDevice = data.total_device;
            var breakdownDevice = data.breakdown_device;
            page = data.page; //当前页 , 0 表示第一页
            page_count = data.page_count; //总页数
            if (code === 0 && (data.device_list.length != 0)) {
                itemArr = eval(data.device_list);
                var row = '';
                for (var i = 0 , l = itemArr.length; i < l; i++) {
                    row += '<tr id="item">';
                    row += '<td id="number">' + (i + 1) + '</td>';
                    row += '<td id="merchant_account">' + itemArr[i].merchant_account + '</td>';
                    row += '<td id="merchant_name">' + itemArr[i].merchant_name + '</td>';
                    row += '<td id="good_boxes">' + itemArr[i].good_boxes + '</td>';
                    row += '<td id="belong">' + belongArr[itemArr[i].belong] + '</td>';
                    row += '<td id="device_type">' + device_typeArr[itemArr[i].device_type] + '</td>';
                    row += '<td id="device_id">' + itemArr[i].device_id + '</td>';
                    row += '<td id="region_code">' + getPositionByCode(itemArr[i].address_info.region_code) + '</td>';
                    row += '<input type="hidden" id="region_code_hide" value="' + itemArr[i].address_info.region_code + '">';
                    row += '<td id="detail_address">' + itemArr[i].address_info.detail_address + '</td>';
                    row += '<td id="price_per_year" style="display:none">' + itemArr[i].price_per_year+ '</td>';
                    row += '<td id="merchant_linker">' + itemArr[i].merchant_linker + '</td>';
                    row += '<td id="merchant_linker_phone" style="display:none">' + itemArr[i].merchant_linker_phone + '</td>';
                    row += '<td id="maintainer" style="display:none">' + itemArr[i].maintainer + '</td>';
                    row += '<td id="maintainer_phone" style="display:none">' + itemArr[i].maintainer_phone + '</td>';
                    row += '<td id="operation" style="display:none">' + itemArr[i].operation + '</td>';
                    row += '<td id="operation_phone" style="display:none">' + itemArr[i].operation_phone + '</td>';
                    row += '<td id="pre_finish_time" style="display:none">' + new Date(parseInt(itemArr[i].pre_finish_time) * 1000).toLocaleDateString() + '</td>';
                    row += '<td id="running_status">' + statusArr[itemArr[i].running_status] + '</td>';
                    row += '<td id="total_sale_money" style="display:none">' + itemArr[i].total_sale_money + '</td>';
                    row += '<td id="boxes" style="display:none">' + itemArr[i].empty_boxes + '/' + itemArr[i].good_boxes + '</td>';
                    row += '<td id="create_time">' + new Date(parseInt(itemArr[i].create_time) * 1000).toLocaleDateString() + '</td>';
                    row += '<td id="apply_time" style="display:none">' + new Date(parseInt(itemArr[i].apply_time) * 1000).toLocaleDateString() + '</td>';
                    row += '<td id="apply_status" style="display:none">' + apply_statusArr[itemArr[i].apply_status] + '</td>';
                    row += '<td id="handle"><div class="button-group button-group-little"><a class="button border-yellow" href="javascript:void(0)" onclick="getItemVal($(this))"><span class="icon-eye"></span> 查看</a></div></td>';
                    row += '</tr>';
                }
                $("#list").append(row);
                $("#cur_page").text(page === undefined ? 0 : page + 1);
                $("#page_count").text(page_count === undefined ? 0 ： page_count);
                $("#totalBoxes").text(totalDevice);
                $("#breakdownBoxes").text(breakdownDevice);
            } else {
                $("#list tr").remove();
            }
        },
        error: function(err) {
            alert("加载失败！");
        }
    });

}


// //修改提交
// function editSubmit() {
//     var data = JSON.stringify({
//         device_id: String($('input[name=device_id]').val()),
//         device_type: Number($('select[name=device_type]').val()),
//         good_boxes: Number($('input[name=good_boxes]').val()),
//         address_info: {
//             detail_address: String($('input[name=detail_address]').val()),
//             region_code: String(getAreaID())
//         },
//         merchant_linker: String($('input[name=merchant_linker]').val()),
//         merchant_linker_phone: String($('input[name=merchant_linker_phone]').val()),
//         maintainer: String($('select[name=maintainer]').val()),
//         maintainer_phone: String($('input[name=maintainer_phone]').val()),
//         operation: String($('select[name=operation]').val()),
//         operation_phone: String($('input[name=operation_phone]').val()),
//         pre_finish_time: parseInt((new Date($('input[name=pre_finish_time]').val())).getTime() / 1000)
//     });
//     $.ajax({
//         type: "POST",
//         contentType: "application/json; charset=utf-8",
//         dataType: "json",
//         url: "/auto/modify_egezi/", //传入后台的地址/方法
//         data: data, //参数，这里是一个json语句
//         success: function(res) {
//             var code = res.code;
//             var data = res.data;
//             var message = res.message;
//             if (code == 0) {
//                 if (data.state == 0) {
//                     alert("修改成功！");
//                     loadList(page);
//                 } else if (data.state == 1) {
//                     alert("此工号不存在！");
//                 } else {
//                     alert("修改失败！");
//                 }
//             } else {
//                 alert("参数错误！");
//             }
//         },
//         error: function(err) {
//             alert("修改失败！");
//         }
//     });
// }

// //弹出修改或新增窗口 todo = 1表示修改，todo = 0表示新增
// function addOrEdit(todo) {
//     layui.use('layer', function() {
//         var layer = layui.layer;
//         layer.open({
//             type: 1,
//             title: todo ? "修改" : "新增",
//             area: ['700px', '500px'],
//             content: $("#seeAboutBox"),
//             btnAlign: 'c',
//             btn: ['提交', '取消'],
//             yes: function() {
//                 if (todo) {
//                     editSubmit();
//                 } else {
//                     addSubmit();
//                 }
//                 layer.closeAll();
//                 loadList(page);
//                 $("#seeAboutBox").css("display", "none");
//                 location.href = "/deviceList.html";
//             },
//             btn2: function() {
//                 layer.closeAll();
//                 $("#seeAboutBox").css("display", "none");
//                 location.href = "/deviceList.html";
//             },
//             cancel: function() {
//                 layer.closeAll();
//                 $("#editBox").css("display", "none");
//                 location.href = "/deviceList.html";
//             }
//         });
//     });
// }
//弹出查看窗口
function seeAbout() {
    layui.use('layer', function() {
        var layer = layui.layer;
        layer.open({
            type: 1,
            title: "详细信息",
            area: ['750px', '350px'],
            content: $("#seeAboutBox"),
            cancel: function() {
                layer.closeAll();
                $("#seeAboutBox").css("display", "none");
            }
        });
    });
}
//获取当前操作项的值 然后弹出查看窗口
function getItemVal(obj) {
    $('.merchant_account').text(obj.parent().parent().parent().find("#merchant_account").text());
    $('.merchant_name').text(obj.parent().parent().parent().find("#merchant_name").text());
    $('.belong').text(obj.parent().parent().parent().find("#belong").text());
    $('.device_type').text(obj.parent().parent().parent().find("#device_type").text());
    $('.boxes').text(obj.parent().parent().parent().find("#boxes").text());
   var tmpRegion_code = obj.parent().parent().parent().find("#region_code_hide").val();
    distpickerPositionByCode(tmpRegion_code);
    $('.region_code').text(obj.parent().parent().parent().find("#region_code").text());
    $('.detail_address').text(obj.parent().parent().parent().find("#detail_address").text());
    $('.price_per_year').text(obj.parent().parent().parent().find("#price_per_year").text());
    $('.merchant_linker').text(obj.parent().parent().parent().find("#merchant_linker").text());
    $('.merchant_linker_phone').text(obj.parent().parent().parent().find("#merchant_linker_phone").text());
    $('.device_id').text(obj.parent().parent().parent().find("#device_id").text());
    $('.maintainer').text(obj.parent().parent().parent().find("#maintainer").text());
    $('.maintainer_phone').text(obj.parent().parent().parent().find("#maintainer_phone").text());
    $('.operation_phone').text(obj.parent().parent().parent().find("#operation_phone").text());
    $('.operation').text(obj.parent().parent().parent().find("#operation").text());
    $('.pre_finish_time').text(obj.parent().parent().parent().find("#pre_finish_time").text());
    $('.running_status').text(obj.parent().parent().parent().find("#running_status").text());
    $('.empty_boxes').text(obj.parent().parent().parent().find("#empty_boxes").text());
    $('.total_sale_money').text(obj.parent().parent().parent().find("#total_sale_money").text());
    $('.create_time').text(obj.parent().parent().parent().find("#create_time").text());
    $('.apply_time').text(obj.parent().parent().parent().find("#apply_time").text());
    $('.apply_status').text(obj.parent().parent().parent().find("#apply_status").text());     
    seeAbout();   
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
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        var start = {
            istime: true,
            festival: true,
            format: 'YYYY-MM-DD hh:mm:ss',
            max: laydate.now(),
            choose: function(datas) {
                end.min = datas; //开始日选好后，重置结束日的最小日期
                end.start = datas //将结束日的初始值设定为开始日
            }
        };

        var end = {
            istime: true,
            festival: true,
            format: 'YYYY-MM-DD hh:mm:ss',
            choose: function(datas) {
                start.max = datas; //结束日选好后，重置开始日的最大日期
            }
        };

        document.getElementById('LAY_demorange_s').onclick = function() {
            start.elem = this;
            laydate(start);
        }
        document.getElementById('LAY_demorange_e').onclick = function() {
            end.elem = this
            laydate(end);
        }

    });
});
