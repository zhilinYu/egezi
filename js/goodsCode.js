//全局变量
var image_id_list; //image ID
var nums = 5; //每页出现的数据量
var page; //用于保存当前页
var page_count;
var resaleArr = ["非零售", "零售", "全部"];
var statusArr = ["注销", "正常", "全部"];
var newDate = new Date();
//请求后台数据并动态加载指定页数（getpage）列表list，每页最多显示5条
function loadList(getpage) {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/auto/bar_code_list/",
        async: false,
        data: {
            page: getpage,
            per_page_count: nums,
            mobile: IsMobile(),
            resale: $("select[name=resale]").val(),
            status: $("select[name=status]").val()
        },
        success: function(res) {
            var code = res.code;
            var data = res.data;
            page = data.page; //当前页 , 0 表示第一页
            page_count = data.page_count; //总页数
            if (code === 0 && (data.bar_code_list.length != 0)) {
                itemArr = eval(data.bar_code_list);
                var row = '';
                for (var i = 0; i < itemArr.length; i++) {
                    $("#list tr").remove();
                    row += '<tr id="item">';
                    row += '<td id="number">' + (i + 1 + page * nums) + '</td>';
                    row += '<td id="bar_code" class="noExl">'+ itemArr[i].bar_code + '</td>';
                    row += '<td id="goods_name">' + itemArr[i].name + '</td>';
                    row += '<td id="image_url"><img src="' + itemArr[i].image_url + '" alt="" width="59px" height="59px"><input type="hidden" id="image_id" value="'+itemArr[i].image_id+'"></td>';
                    //row += '<td id="image_id" style="display:none">'+itemArr[i].image_id+'</td>';
                    row += '<td id="resale" class="resale">' + resaleArr[itemArr[i].resale] + '</td>';
                    row += '<td id="type">' + itemArr[i].type + '</td>';
                    row += '<td id="sale_price">' + itemArr[i].sale_price / 100 + '</td>';
                    row += '<td id="cost_price">' + itemArr[i].cost_price / 100 + '</td>';
                    row += '<td id="expire_time">' + itemArr[i].expire_time + '</td>';
                    row += '<td id="register">' + itemArr[i].register + '</td>';
                    row += '<td id="status" class="status">' + statusArr[itemArr[i].status] + '</td>';
                    row += '<td id="create_time">' + newDate.toLocaleDateString(itemArr[i].create_time) + '</td>';
                    row += '<td id="handle"><div class="button-group"> <button class="button border-main editBtn" onclick="getItemVal($(this));"><span class="icon-edit"></span> 修改</button> <button class="button border-red" onclick="del($(this));"><span class="icon-lock"></span> 注销</button> </div></td>';
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
                //设置零售商品不被导出excel
                $(".resale").each(function(){
                    if($(this).text() === "零售"){
                        $(this).parent().addClass("noExl");
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
//搜索
function changesearch() {

}

//单个注销
function del(obj) {
    var data = JSON.stringify({
        bar_code: String(obj.parent().parent().parent().find("#bar_code").text())
    });
    if (confirm("您确定要注销吗?")) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            url: "/auto/cancel_bar_code/", //传入后台的地址/方法
            data: data, //参数，这里是一个json语句
            success: function(res) {
                var code = res.code;
                var data = res.data;
                if (code == 0) {
                    if (data.state == 0) {
                        alert("注销成功！");
                        //设置操作按钮的状态
                        loadList(page);
                        obj.css("disabled", true);
                    } else {
                        alert("条码不存在！");
                    }
                }
            },
            error: function(err) {
                alert("操作失败！");
            }
        });
    }
}

//修改提交表单
function editSubmit() {
    //将数据序列化为json字符串
    var data_json = JSON.stringify({
        bar_code: String($('input[name=bar_code]').val()),
        name: String($('input[name=goods_name]').val()),
        type: String($('select[name=type]').val()),
        cost_price: parseInt($('input[name=cost_price]').val() * 100),
        sale_price: parseInt($('input[name=sale_price]').val() * 100),
        //image_id: image_id_list
        image_id: String($("#hidden").val())
    });
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/auto/modify_bar_code/", //传入后台的地址/方法
        data: data_json, //参数，这里是一个json语句
        success: function(res) {
            var code = res.code;
            var data = res.data;
            var message = res.message;
            if (code !== 0) {
                alert("参数错误！");
                return;
            }
            if (data.state == 0) {
                alert("修改成功！");
            } else {
                alert("修改失败！");
            }

        },
        error: function(err) {
            alert("未知错误:" + err);
        }
    });
}

//新增提交表单
function submitAjax() {
    //将数据序列化为json字符串
    var data_json = JSON.stringify({
        bar_code: String($('input[name=bar_code]').val()),
        name: String($('input[name=goods_name]').val()),
        resale: Number($('input[name=resale]:checked').val()),
        type: String($('select[name=type]').val()),
        cost_price: parseInt($('input[name=cost_price]').val() * 100),
        sale_price: parseInt($('input[name=sale_price]').val() * 100),
        register: String($('input[name=register]').val()),
        expire_time: Number($('input[name=expire_time]').val()),
        //image_id: image_id_list
        image_id: String($("#hidden").val())
    });
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/auto/add_bar_code/", //传入后台的地址/方法
        data: data_json, //参数，这里是一个json语句
        success: function(res) {
            var code = res.code;
            var data = res.data;
            var message = res.message;
            if (code !== 0) {
                alert("参数错误！");
                return;
            }
            if (data.state === 0) {
                alert("添加成功！");
            } else if (data.state === 1) {
                alert("重复添加！");
            } else {
                alert("图片id不存在！");
            }
        },
        error: function(err) {
            alert("添加失败！");
        }
    });
}

//todo = 1表示修改，todo = 0表示新增
function addOrEdit(todo) {
    layui.use('layer', function() {
        var layer = layui.layer;
        layer.open({
            type: 1,
            title: todo ? "修改商品" : "新增商品",
            area: ['700px', '500px'],
            content: $("#editBox"),
            //btnAlign: 'c',
            //btn: ['提交', '取消'],
            success: function(layero, index) {
                //设置提交和取消按钮函数
                $("#submitBtn").click(function() {
                    $("#ajaxForm").ajaxSubmit(function() {
                        if($('#editBox input[name=resale]:checked').val() == 0 && $("#editBox input[name=bar_code]").val().length != 6) {
                            alert("非零售商品编码必须为6位数字！");
                            $('#editBox input[name=bar_code]').focus();
                            return ;
                        }
                        if (todo) {
                            editSubmit();
                        } else {
                            submitAjax();
                        }
                        layer.closeAll();
                        $("#editBox").css("display", "none");
                        location.href = "/goodsCode.html";
                        loadList(page);
                    });

                });
                $("#cancalBtn").click(function() {
                    layer.closeAll();
                    $("#editBox").css("display", "none");
                    location.href = "/goodsCode.html";
                });
            },
            // yes: function() {
            //     if (todo) {
            //         editSbumit();
            //     } else {
            //         submitAjax();
            //     }
            //     layer.closeAll();
            //     $("#editBox").css("display", "none");
            //     location.href = "/goodsCode.html";
            //     loadList(page);
            // },
            // btn2: function() {
            //     layer.closeAll();
            //     $("#editBox").css("display", "none");
            //     location.href = "/goodsCode.html";
            // },
            cancel: function(index, layero) {
                layer.closeAll();
                $("#editBox").css("display", "none");
                location.href = "/goodsCode.html";
            }
        });
    });
}

//获取当前操作项的值 然后弹出修改
function getItemVal(obj) {
    $('input[name=goods_name]').val(obj.parent().parent().parent().find("#goods_name").text());
    $('input[name=bar_code]').val(obj.parent().parent().parent().find("#bar_code").text());
    $('input[name=bar_code]').prop("disabled",true);
    $('#hidden').val(obj.parent().parent().parent().find("#image_id").val());
    $("#file").removeAttr("data-validate");
    var tmpresale = obj.parent().parent().parent().find("#resale").text();
    if (tmpresale == "非零售") {
        $('input[name=resale]:eq(0)').prop("checked", false);
        $('input[name=resale]:eq(1)').prop("checked", true);
    } else {
        $('input[name=resale]:eq(0)').prop("checked", true);
        $('input[name=resale]:eq(1)').prop("checked", false);
    }
    $('input[name=resale]:eq(0)').prop("disabled", true);
    $('input[name=resale]:eq(1)').prop("disabled", true);
    $('select[name=type]').val(obj.parent().parent().parent().find("#type").text());
    $('input[name=cost_price]').val(obj.parent().parent().parent().find("#cost_price").text());
    $('input[name=sale_price]').val(obj.parent().parent().parent().find("#sale_price").text());
    $('input[name=register]').val(obj.parent().parent().parent().find("#register").text());
    $('input[name=register]').prop("disabled", true);
    $('input[name=expire_time]').val(obj.parent().parent().parent().find("#expire_time").text());
    $('input[name=expire_time]').prop("disabled", true);
    addOrEdit(1);
}
//图片上传
function uploadPicture(URL) {
    if (!document.getElementById('file').files[0]) {
        alert("请选择图片！");
        return;
    }
    $("#progress").show();
    // 检查是否支持FormData
　　if(window.FormData) {　
　　　　var formData = new FormData();
　　　　// 建立一个upload表单项，值为上传的文件
　　　　formData.append('images', document.getElementById('file').files[0]);
　　　　var xhr = new XMLHttpRequest();
　　　　xhr.open('POST', URL);
　　　　// 定义上传完成后的回调函数
　　　　xhr.onload = function () {
            $("#progress").hide();
　　　　　　if (xhr.status === 200) {
                var res = JSON.parse(xhr.response);
                var code = res.code;
                var data = res.data;
                var message = res.message;
                console.log(res);
　　　　　　　　if (code === 0) {
                    alert("上传成功");               
                    if (data.image_id_list[0]) {
                         //image_id_list = data.image_id_list[0];
                         $("#hidden").val(data.image_id_list[0]);
                    }
                }
　　　　　　} else {
　　　　　　　　alert('上传失败');
　　　　　　}
　　　　};
        xhr.upload.onprogress = function (event) {
    　　　　if (event.lengthComputable) {
    　　　　　　 var percentComplete = Math.round(event.loaded * 100 / event.total);
                    document.getElementById('progress').style.width = percentComplete;
                    document.getElementById('progressNumber').style.width = percentComplete + "%";
    　　　　}
　　　　};
　　　　xhr.send(formData);
　　}
    

　
    // if ($('#file')[0].files[0]) {
    //     $("#progress").show();
    //     var formData = new FormData();
    //     formData.append('images', $('#file')[0].files[0]);
    //     $.ajax({
    //         url: URL,
    //         type: 'POST',
    //         cache: false,
    //         data: formData,
    //         processData: false,
    //         contentType: false
    //     }).done(function(res) {
    //         $("#progress").hide();
    //         var code = res.code;
    //         var data = res.data;
    //         var message = res.message;
    //         if (code === 0) {
    //             alert("上传成功");               
    //             if (data.image_id_list[0]) {
    //                 image_id_list = data.image_id_list[0];
    //                 $("#hidden").val(data.image_id_list[0]);
    //             }
    //         } else {
    //             alert(message);
    //         }
    //     }).fail(function(res) {
    //         $("#progress").hide();
    //         alert("上传失败！");
    //     });
    // }
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

    //导出excle表格
    $("#exclebtn").click(function(){
        $("#goodsTable").table2excel({
            exclude: ".noExl",
            name: "Excel Document Name",
            filename: "goodsTable",
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true
         });
    });           

    
});
