//全局变量
var nums = 5; //每页出现的数据量
var page = 0; //用于保存当前页
var page_count = 0;
var statusArr = ["空箱", "上架中", "上架失败", "可售卖","商品锁定支付中","开箱失败","已售卖","下架中","下架失败","商品过期"];
var orderStatusArr = ["待支付", "已支付（开箱失败）", "已支付（开箱成功）", "订单过期"];
var newDate = new Date();
//请求后台数据并动态加载指定页数（getpage）列表list，每页最多显示5条
function loadList(getpage) {
    var getData = {
        _id: $('input[name=_id]').val(),
        merchant_account: String($('input[name=merchant_account]').val()),
        begin_time: (new Date($('#LAY_demorange_s').val())).getTime() / 1000 || Math.floor((newDate.getTime() - 15 * 24 * 60 * 60 *1000) / 1000),
        end_time: (new Date($('#LAY_demorange_e').val())).getTime() / 1000 || Math.ceil(newDate.getTime() / 1000),
        page: getpage,
        per_page_count: nums //每页限定的数据
    };
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/auto/order_list/",
        async: false,
        data:getData,
        success: function(res) {
            var code = res.code;
            var data = res.data;
            var itemArr = eval(data.order_list);
            page = data.page; //当前页 , 0 表示第一页
            page_count = data.page_count; //总页数
            if (code === 0 && (itemArr.length != 0)) {
                var itemArr = eval(data.order_list);
                var row = '';
                var totalMmoney=0;
                for (var i = 0; i < itemArr.length; i++) {
                    totalMmoney += itemArr[i].total_money/100;
                    $("#list tr").remove();
                    row += '<tr id="item">';
                    row += '<td id="number">' + (i + 1 + page * nums) + '</td>';
                    row += '<td id="goods_id">' + itemArr[i]._id + '</td>';
                    //row += '<td id="merchant_account">' + itemArr[i].merchant_account + '</td>';
                    row += '<td id="merchant_name">' + itemArr[i].merchant_name + '</td>';
                    row += '<td id="device_id">' + itemArr[i].device_id + '</td>';
                    row += '<td id="device_address">' + itemArr[i].device_address + '</td>';
                    row += '<td id="total_money">' + itemArr[i].total_money/100 + '</td>';
                    row += '<td id="orderStatusArr">' + orderStatusArr[itemArr[i].status] + '</td>';
                    row += '<td id="exchange_time">' + new Date(parseInt(itemArr[i].exchange_time)*1000).toLocaleDateString() + '</td>';
                    row += '<td id="handle"><div class="button-group button-group-little"><a class="button border-yellow" href="javascript:void(0)" onclick="seeGoodsInfo($(this))"><span class="icon-eye"></span> 查看</a></div></td>';
                    row += '</tr>';
                }
                $("#list").append(row);
                $("#totalMoney").text(totalMmoney+"元");
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
//弹出查看商品信息窗口
function seeGoodsInfo(obj){
    var thisGoods_id = obj.parent().parent().parent().find("#goods_id").text();
    setcookie("thisGoods_id",thisGoods_id,1440);
            layui.use('layer', function() {
            var layer = layui.layer;
            layer.open({
                type: 2,
                title: "商品详情",
                area: ['1000px', '450px'],
                scrollbar: true,
                content: "/goodsInfo.html",
                cancel: function() {
                    layer.closeAll();
                }
            });
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

    //加载日期插件
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
