//全局变量
var nums = 5; //每页出现的数据量
var page = 0; //用于保存当前页
var page_count = 0;
var statusArr = ["空箱", "上架中", "上架失败", "可售卖","商品锁定支付中","开箱失败","已售卖","下架中","下架失败","商品过期"];
//请求后台数据并动态加载指定页数（getpage）列表list，每页最多显示5条
function loadList(getpage) {
    var data = {
        _id: getcookie("thisGoods_id"),
        page: getpage,
        per_page_count: nums //每页限定的数据
    };
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/auto/order_list/",
        async: false,
        data: data,
        success: function(res) {
            var code = res.code;
            var data = res.data;
            var itemArr = eval(data.order_list);
            page = data.page; //当前页 , 0 表示第一页
            page_count = data.page_count; //总页数
            if (code === 0 && (data.order_list.length != 0)){
                var row = '';
                for (var i = 0; i < itemArr.length; i++) {
                    var item_productArr = itemArr[i].goods_list;
                    $("#list tr").remove();
                    for (var i = 0; i < item_productArr.length; i++) {
                        row += '<tr id="item">';
                        row += '<td id="number">' + (i + 1 + page * nums) + '</td>';
                        row += '<td id="name">' + item_productArr[i].name + '</td>';
                        row += '<td id="image_url"><img src="' + item_productArr[i].image_url + '" alt="" width="59px" height="59px"><input type="hidden" id="image_id" value="' + item_productArr[i].image_id + '"></td>';
                        row += '<td id="bar_code">' + item_productArr[i].bar_code + '</td>';
                        row += '<td id="box_number">' + item_productArr[i].box_number + '</td>';
                        row += '<td id="type">' + item_productArr[i].type + '</td>';
                        row += '<td id="number">' + item_productArr[i].number + '</td>';
                        row += '<td id="total_weight">' + item_productArr[i].total_weight/1000 + '</td>';
                        row += '<td id="add_time">' + new Date(parseInt(item_productArr[i].add_time) * 1000).toLocaleDateString() + '</td>';
                        row += '<td id="expire_time">' + new Date(parseInt(item_productArr[i].expire_time) * 1000).toLocaleDateString() + '</td>';
                        row += '<td id="status" class="status">' + statusArr[item_productArr[i].status] + '</td>';
                         row += '<td id="price">' + item_productArr[i].price/100 + '</td>';
                          row += '<td id="total_money">' + item_productArr[i].total_money/100 + '</td>';
                        row += '</tr>';
                    }
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
    $("#prev").click(function() {
        var prevPage = (page - 1) < 0 ? 0 : page - 1;
        loadList(prevPage);
    });
    $("#next").click(function() {
        var nextPage = (page + 1) >= page_count ? page_count - 1 : page + 1;
        loadList(nextPage);
    });

});
