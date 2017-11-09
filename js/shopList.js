//全局变量
var nums = 10; //每页出现的数据量
var page = 0; //用于保存当前页
var page_count = 0;
var statusArr = ["注销", "正常", "全部"];
var merchant_typeArr = ["", "第三方商家", "加盟商家"];
//请求后台数据并动态加载指定页数（getpage）列表list，每页最多显示5条
function loadList(getpage) {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/auto/merchant_list/",
        async: false,
        data: {
            page: getpage,
            per_page_count: nums //每页限定的数据
        },
        success: function(res) {
            var code = res.code;
            var data = res.data;
            page = data.page; //当前页 , 0 表示第一页
            page_count = data.page_count; //总页数
            if (code === 0 && (data.merchant_list.length != 0)) {
                itemArr = eval(data.merchant_list);
                var row = '';
                for (var i = 0; i < itemArr.length; i++) {
                    $("#list tr").remove();
                    row += '<tr id="item">';
                    row += '<td id="number">' + (i + 1 + page * nums) + '</td>';
                    row += '<td id="merchant_number">' + itemArr[i].merchant_number + '</td>';
                    row += '<td id="merchant_account">' + itemArr[i].merchant_account + '</td>';
                    row += '<td id="merchant_name">' + itemArr[i].merchant_name + '</td>';
                    row += '<td id="region_code">' + getPositionByCode(itemArr[i].region_code) + '</td>';
                    row += '<input type="hidden" id="region_code_hide" value="' + itemArr[i].region_code + '">';
                    row += '<td id="merchant_type">' + merchant_typeArr[itemArr[i].merchant_type] + '</td>';
                    row += '<td id="merchant_linker">' + itemArr[i].merchant_linker + '</td>';
                    row += '<td id="merchant_linker_phone">' + itemArr[i].merchant_linker_phone + '</td>';
                    row += '<td id="card" style="display:none">' + itemArr[i].card + '</td>';
                    row += '<td id="cardholder" style="display:none">' + itemArr[i].cardholder + '</td>';
                    row += '<td id="bank_name" style="display:none">' + itemArr[i].bank_name + '</td>';
                    row += '<td id="rate" style="display:none">' + itemArr[i].rate + '</td>';
                    row += '<td id="remain_money" style="display:none">' + itemArr[i].remain_money + '</td>';
                    row += '<td id="device_number" style="display:none">' + itemArr[i].device_number + '</td>';
                    row += '<td id="status" class="status">' + statusArr[itemArr[i].status] + '</td>';
                    row += '<td id="register_date">' + new Date(parseInt(itemArr[i].register_date)*1000).toLocaleDateString() + '</td>';
                    row += '<td id="handle"><div class="button-group button-group-little"> <button class="button border-main editBtn" onclick="getItemVal($(this),1);"><span class="icon-edit"></span> 修改</button> <button class="button border-red" onclick="delSubmit($(this));"><span class="icon-lock"></span> 注销</button><button class="button border-yellow" onclick="getItemVal($(this),0);"><span class="icon-eye"></span> 详细信息</button><button class="button border-blue" onclick="seeOperation($(this));"><span class="icon-eye"></span> 运营人员</button></div></td>';
                    row += '</tr>';

                }
                $("#list").append(row);
                $("#cur_page").text(page + 1);
                $("#page_count").text(page_count);
                $(".status").each(function(){
                    if($(this).text() === "注销"){
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

//加载第三方商家运营人员列表
function loadOperationList(obj) {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/auto/user_list/",
        async: false,
        data: {
            merchant_number: obj.parent().parent().parent().find("#merchant_number").text(),
            work_role: 6,
            page: 0,
            per_page_count: 999 //每页限定的数据
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
                    $("#operation_list tr").remove();
                    row += '<tr id="item2">';
                    row += '<td id="number2">' + (i + 1) + '</td>';
                    //row += '<td id="merchant_number">' + itemArr[i].merchant_number + '</td>';
                    row += '<td id="job_member2">' + itemArr[i].job_member + '</td>';
                    row += '<td id="name2">' + itemArr[i].name + '</td>';
                    //row += '<td id="work_role2">第三方运营人员</td>';
                    row += '<td id="region2">' + getPositionByCode(itemArr[i].region) + '</td>';
                    row += '<input type="hidden" id="region_code_hide2" value="' + itemArr[i].region + '">';
                    row += '<td id="phone2">' + itemArr[i].phone + '</td>';
                    row += '<td id="qq2">' + itemArr[i].qq + '</td>';
                    row += '<td id="work_content2">' + itemArr[i].work_content + '</td>';
                    //row += '<td id="device_number">' + itemArr[i].device_number + '</td>';
                    row += '<td id="register_date2">' + new Date(parseInt(itemArr[i].register_date)*1000).toLocaleDateString() + '</td>';
                    row += '<td id="status2" class="status2">' + statusArr[itemArr[i].status] + '</td>';
                    row += '<td id="handle2"><div class="button-group button-group-little"> <button class="button border-main editBtn" onclick="getItemVal($(this))"><span class="icon-edit"></span> 修改</button> <button class="button border-red" onclick="delSubmit($(this));"><span class="icon-lock"></span> 注销</button><a href="javascript:void(0)" class="button border-green" onclick="EnableSubmit($(this));"><span class="icon-unlock"></span> 激活</a><button class="button border-yellow" onclick="resetPassword($(this));"><span class="icon-refresh"></span> 重置密码</button> </div></td>';
                    row += '</tr>';

                }
                $("#operation_list").append(row);
                //设置注销状态下按钮的状态颜色
                $(".status2").each(function(){
                    if($(this).text() === "注销"){
                        $(this).parent().find("#handle button").attr("disabled",true);
                        $(this).parent().find("#handle button").css("color","gray");
                        $(this).parent().find("#handle button").css("border-color","gray");
                    }
                });

            } else {
                $("#operation_list tr").remove();
            }
        }
    });

}

//注销
function delSubmit(obj) {
    var data = JSON.stringify({
        merchant_number: String(obj.parent().parent().parent().find("#merchant_number").text()),
        merchant_linker: String(obj.parent().parent().parent().find("#merchant_linker").text()),
        merchant_linker_phone: String(obj.parent().parent().parent().find("#merchant_linker_phone").text()),
        card: String(obj.parent().parent().parent().find("#card").text()),
        cardholder: String(obj.parent().parent().parent().find("#cardholder").text()),
        bank_name: String(obj.parent().parent().parent().find("#bank_name").text()),
        status: 0
    });
    if (confirm("您确定要注销吗?")) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "/auto/modify_merchant/", //传入后台的地址/方法
            data: data, //参数，这里是一个json语句
            success: function(res) {
                var code = res.code;
                var data = res.data;
                var message = res.message;
                if (code == 0) {
                    if (data.state == 0) {
                        alert("注销成功！");
                        loadList(page);
                    } else if (data.state == 1) {
                        alert("商家编号不存在！");
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
    }
}

//修改提交
function editSubmit() {
    var data = JSON.stringify({
        merchant_number: String($('input[name=merchant_number]').val()),
        merchant_linker: String($('input[name=merchant_linker]').val()),
        merchant_linker_phone: String($('input[name=merchant_linker_phone]').val()),
        card: String($('input[name=card]').val()),
        cardholder: String($('input[name=cardholder]').val()),
        bank_name: String($('input[name=bank_name]').val()),
        status: 1
    });
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/auto/modify_merchant/", //传入后台的地址/方法
        data: data, //参数，这里是一个json语句
        success: function(res) {
            var code = res.code;
            var data = res.data;
            var message = res.message;
            if (code == 0) {
                if (data.state == 0) {
                    alert("修改成功！");
                    loadList(page);
                } else if (data.state == 1) {
                    alert("商家编号不存在！");
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
        region_code: String($('#district :selected').attr("data-code")),
        merchant_name: String($('input[name=merchant_name]').val()),
        merchant_type: Number($('select[name=merchant_type]').val()),
        merchant_linker: String($('input[name=merchant_linker]').val()),
        merchant_linker_phone: String($('input[name=merchant_linker_phone]').val()),
        card: String($('input[name=card]').val()),
        cardholder: String($('input[name=cardholder]').val()),
        bank_name: String($('input[name=bank_name]').val()),
        rate: String($('input[name=rate]').val())
    });
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/auto/add_merchant/", //传入后台的地址/方法
        data: data, //参数，这里是一个json语句
        success: function(res) {
            var code = res.code;
            var data = res.data;
            var message = res.message;
            if (code == 0) {
                if (data.state == 0) {
                    alert("添加成功！");
                    loadList(page);
                } else if (data.state == 1) {
                    alert("商家联系人号码重复存在！");
                    loadList(page);
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
                        if (($('#seachprov').val() == 0 || $('#seachcity').val() == 0 || $('#seachdistrict').val() == 0) && todo == 0) {
                            alert("请选择地区！");
                            return;
                        }
                        if (!checkCard($('input[name=card]').val())) {
                            alert("请输入正确的银行卡号！");
                            return;
                        }
                        if (todo) {
                            editSubmit();
                        } else {
                            addSubmit();
                        }
                        layer.closeAll();
                        $("#editBox").css("display", "none");
                        location.href = "/shopList.html";
                        loadList(page);
                    });

                });
                $("#cancalBtn").click(function() {
                    layer.closeAll();
                    $("#editBox").css("display", "none");
                    location.href = "/shopList.html";
                });
            },
            cancel: function() {
                layer.closeAll();
                $("#editBox").css("display", "none");
                location.href = "/shopList.html";
            }
        });
    });
}


//弹出查看详细信息窗口
function seeAbout() {
        layui.use('layer', function() {
            var layer = layui.layer;
            layer.open({
                type: 1,
                title: "详细信息",
                area: ['700px', '250px'],
                content: $("#seeAboutBox"),
                cancel: function() {
                    layer.closeAll();
                    $("#seeAboutBox").hide();
                }
            });
        });
}

//弹出查看运营人员列表
function seeOperation(obj){
    var thisAccount = obj.parent().parent().parent().find("#merchant_account").text();
    setcookie("thisAccount",thisAccount,1440);
    var thisMtype = obj.parent().parent().parent().find("#merchant_type").text();
    if (thisMtype === "第三方商家") {
            layui.use('layer', function() {
            var layer = layui.layer;
            layer.open({
                type: 2,
                title: "运营人员列表",
                area: ['900px', '450px'],
                scrollbar: true,
                content: "/operation.html",
                // success: function(){
                //     loadOperationList(obj);
                // },
                cancel: function() {
                    layer.closeAll();
                    $("#seeAboutBox").hide();
                    location.href = "/shopList.html";
                }
            });
        });
    }else{
        alert("加盟商家没有运营人员列表！");
    }
}
//获取当前操作项的值 然后弹出修改或查看窗口，todo=1表示修改，0表示查看
function getItemVal(obj,todo) {
    if (todo) {
        $('input[name=merchant_name]').val(obj.parent().parent().parent().find("#merchant_name").text());
        $('input[name=merchant_name]').prop("disabled",true);
        $('input[name=merchant_number]').val(obj.parent().parent().parent().find("#merchant_number").text());
        var tmpRegion_code = obj.parent().parent().parent().find("#region_code_hide").val();
        distpickerPositionByCode(tmpRegion_code);
        $("#regionArea select").each(function(){
            $(this).prop("disabled",true);
        });
        $('select[name=merchant_type]').val(merchant_typeArr.indexOf(obj.parent().parent().parent().find("#merchant_type").text()));
        $('input[name=merchant_linker]').val(obj.parent().parent().parent().find("#merchant_linker").text());
        $('input[name=merchant_linker_phone]').val(obj.parent().parent().parent().find("#merchant_linker_phone").text());
        $('input[name=card]').val(obj.parent().parent().parent().find("#card").text());
        $('input[name=cardholder]').val(obj.parent().parent().parent().find("#cardholder").text());
        $('input[name=bank_name]').val(obj.parent().parent().parent().find("#bank_name").text());
        $('input[name=rate]').val(obj.parent().parent().parent().find("#rate").text());
        $('input[name=remain_money]').val(obj.parent().parent().parent().find("#remain_money").text());
        $('input[name=device_number]').val(obj.parent().parent().parent().find("#device_number").text());
        $('input[name=status]').val(obj.parent().parent().parent().find("#status").text());
        $('input[name=register_date]').val(obj.parent().parent().parent().find("#register_date").text());
        $('select[name=merchant_type]').prop("disabled", true);
        $('input[name=rate]').prop("disabled", true);
        $('input[name=remain_money]').prop("disabled", true);
        $('input[name=device_number]').prop("disabled", true);
        $('input[name=status]').prop("disabled", true);
        $('input[name=register_date]').prop("disabled", true);
        addOrEdit(1);
    }else{
        $('.merchant_number').text(obj.parent().parent().parent().find("#merchant_number").text());
        $('.merchant_account').text(obj.parent().parent().parent().find("#merchant_account").text());
        $('.merchant_name').text(obj.parent().parent().parent().find("#merchant_name").text());
        $(".region_code").text(getPositionByCode(obj.parent().parent().parent().find("#region_code_hide").val()));
        $('.merchant_type').text(obj.parent().parent().parent().find("#merchant_type").text());
        $('.merchant_linker').text(obj.parent().parent().parent().find("#merchant_linker").text());
        $('.merchant_linker_phone').text(obj.parent().parent().parent().find("#merchant_linker_phone").text());
        $('.card').text(obj.parent().parent().parent().find("#card").text());
        $('.cardholder').text(obj.parent().parent().parent().find("#cardholder").text());
        $('.bank_name').text(obj.parent().parent().parent().find("#bank_name").text());
        $('.rate').text(obj.parent().parent().parent().find("#rate").text() + "%");
        $('.remain_money').text(obj.parent().parent().parent().find("#remain_money").text());
        $('.device_number').text(obj.parent().parent().parent().find("#device_number").text());
        $('.status').text(obj.parent().parent().parent().find("#status").text());
        $('.register_date').text(obj.parent().parent().parent().find("#register_date").text());
        seeAbout();
    }
}
// 正则验证银行卡方法
function checkCard (content) {
    var regex = /^(\d{16}|\d{19})$/;
    if (regex.test(content)) {
        return true;
    }
    return false;
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
    $("#prev").click(function() {
        var prevPage = (page - 1) < 0 ? 0 : page - 1;
        loadList(prevPage);
    });
    $("#next").click(function() {
        var nextPage = (page + 1) >= page_count ? page_count - 1 : page + 1;
        loadList(nextPage);
    });


    //全选
    $("#checkall").click(function() {
        $("input[name='id[]']").each(function() {
            if (this.checked) {
                this.checked = false;
            } else {
                this.checked = true;
            }
        });
    })
});
