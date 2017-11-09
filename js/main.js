//公共方法
//判断是否是mobile设备
function IsMobile() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod"];
    var flag = 0;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = 1;
            break;
        }
    }
    if (window.screen.width >= 768) {
        flag = 0;
    }
    return flag;
}

function setcookie(name, value, expirehours) {
    var cookieString = name + '=' + escape(value);
    if (expirehours > 0) {
        var date = new Date();
        date.setTime(date.getTime() + expirehours * 3600 * 1000);
        cookieString = cookieString + '; expires=' + date.toUTCString();
        document.cookie = cookieString;
    }
    document.cookie = cookieString;
}

function getcookie(name) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split('; ');
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split('=');
        if (arr[0] == name)
            return unescape(arr[1]);
    }
    return '';
}

//导出excle表格
function fntableExport(tableId){
    $('#tableId').tableExport({type:'excel', separator:';', escape:'false'});
}
// separator: ','
// ignoreColumn: [2,3],
// tableName:'yourTableName'
// type:'csv'
// pdfFontSize:14
// pdfLeftMargin:20
// escape:'true'
// htmlContent:'false'
// consoleLog:'false' 

// 获取地区名（编码）
function getPositionByCode(districtCode) {
    var provinceCode = parseInt(parseInt(districtCode) / 10000) * 10000;
    var cityCode = parseInt(parseInt(districtCode) / 100) * 100;
    var province = ChineseDistricts[86][provinceCode] || "";
    var city = ChineseDistricts[provinceCode][cityCode] || "";
    var district = ChineseDistricts[cityCode][districtCode] || "";
    return province + city + district;
}
// 地区定位（编码）
function distpickerPositionByCode(districtCode) {
    var provinceCode = parseInt(parseInt(districtCode) / 10000) * 10000;
    var cityCode = parseInt(parseInt(districtCode) / 100) * 100;
    var $province = $("#province");
    var $city = $("#city");
    var $district = $("#district");
    var province = ChineseDistricts[86][provinceCode] || "";
    var city = ChineseDistricts[provinceCode][cityCode] || "";
    var district = ChineseDistricts[cityCode][districtCode] || "";
    $province.val(province);
    $province.trigger("change");
    $city.val(city);
    $city.trigger("change");
    $district.val(district);
    $district.trigger("change");
}


  