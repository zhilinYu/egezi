//全局变量
var nums = 5; //每页出现的数据量
var page = 0; //用于保存当前页
var page_count = 0;
var money_typeArr = ["提成", "体现", "全部"];
var merchant_typeArr = ["", "平台商家", "加盟商家"];
var statusArr = ["", "申请中", "已处理"];
var newDate = new Date();
//请求后台数据并动态加载指定页数（getpage）列表list，每页最多显示5条
function loadList(getpage) {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/auto/mcx_list",
        async: false,
        data: {
            merchant_account: $('input[name=merchant_account]').val(),
            money_type: $('input[name=money_type]').val(),
            page: getpage,
            per_page_count: nums //每页限定的数据
        },
        success: function(res) {
            var code = res.code;
            var data = res.data;
            page = data.page; //当前页 , 0 表示第一页
            page_count = data.page_count; //总页数
            if (code === 0 && (data.order_list.length != 0)) {
                itemArr = eval(data.order_list);
                item_productArr = eval(data.order_list.product_list);
                var row = '';
                for (var i = 0; i < itemArr.length; i++) {
                    $("#list tr").remove();
                    row += '<tr id="item">';
                    row += '<td id="number">' + (i + 1) + '</td>';
                    row += '<td id="id">' + itemArr[i].id + '</td>';
                    row += '<li id="exchange_time">' + newDate.toLocaleDateString(itemArr[i].exchange_time) + '</li>';
                    row += '<td id="merchant_account">' + itemArr[i].merchant_account + '</td>';
                    row += '<td id="merchant_name">' + itemArr[i].merchant_name + '</td>';
                    row += '<td id="merchant_type">' + merchant_typeArr[itemArr[i].merchant_type] + '</td>';
                    row += '<td id="exchange_content">' + itemArr[i].exchange_content + '</td>';
                    row += '<td id="exchange_money">' + itemArr[i].exchange_money + '</td>';
                    row += '<td id="card">' + itemArr[i].card + '</td>';
                    row += '<td id="cardholder">' + itemArr[i].cardholder + '</td>';
                    row += '<td id="wechataccount">' + itemArr[i].wechataccount + '</td>';
                    row += '<td id="linker">' + itemArr[i].linker + '</td>';
                    row += '<td id="linker_phone">' + itemArr[i].linker_phone + '</td>';
                    row += '<td id="status">' + statusArr[itemArr[i].status] + '</td>';
                    row += '<td id="money_type">' + itemArr[i].money_type + '</td>';
                    row += '</tr>';
                }
                $("#list").append(row);
                $("#cur_page").text(page_count ? page + 1 : 0);
                $("#page_count").text(page_count || 0);
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
    $("#prev").click(function() {
        var prevPage = (page - 1) < 0 ? 0 : page - 1;
        loadList(prevPage);
    });
    $("#next").click(function() {
        var nextPage = (page + 1) >= page_count ? page_count - 1 : page + 1;
        loadList(nextPage);
    });

});
