function loadList(getpage) {
   $.ajax({
        type: "GET",
        url: "/auto/home-statistic",
        success: function(res) {
            var code = res.code;
            var data = res.data; 
			var year_profits = data.year_profits;
			var year_sales = data.year_sales;
			var profits_data=[];
			var sales_data=[];
            if (code === 0){
               $("#devices_Nums").val(data.running_devices + "/" + data.total_devices);
			   $("#marchants_Nums").val(data.third_merchant + "/" + data.joining_merchant);
			   $("#current_month_profit").val(data.current_month_profit ? data.current_month_profit/100 : "0");
			   for (var k in year_profits){
				   profits_data.push(year_profits[k].total_money/100);
			   }
			   for (var k in year_sales){
				   sales_data.push(year_sales[k].total_money/100);
			   }
			   // 基于准备好的dom，初始化echarts实例
                    var myChart1 = echarts.init(document.getElementById('echarts1'));
                    // 指定图表的配置项和数据
                    option1 = {
                                    title: {
                                        text: '年度平台盈利情况'
                                    },
                                    tooltip: {
                                        trigger: 'axis'
                                    },
                                    legend: {
                                        data:['盈利(元)']
                                    },
                                    grid: {
                                        left: '3%',
                                        right: '4%',
                                        bottom: '3%',
                                        containLabel: true
                                    },
                                    xAxis: [
										{
											type: 'category',
											boundaryGap: false,
											data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
											//data: ['一','二','三','四','五','六','七']
										}
                                    ],
                                    yAxis: [
										{
											type: 'value',
											//data: ['10%','20%','30%','40%','50%','60%','70%','80%','90%','100%']

										}
									],
                                    series: [
                                        {
                                            name:'盈利(元)',
                                            type:'line',
                                            stack: '总盈利',
											areaStyle: {normal: {}},
                                            data:profits_data
                                        }
                                    ]
                                };

                    // 使用刚指定的配置项和数据显示图表。
                    myChart1.setOption(option1);
					
					// 基于准备好的dom，初始化echarts实例
                    var myChart2 = echarts.init(document.getElementById('echarts2'));

                    // 指定图表的配置项和数据
                    option2= {
                                    title: {
                                        text: '年度平台销售情况'
                                    },
                                    tooltip: {
                                        trigger: 'axis',
										axisPointer: {
											type: 'cross',
											label: {
												backgroundColor: '#6a7985'
										}
									}
                                    },
                                    legend: {
                                        data:['销量(元)']
                                    },
                                    grid: {
                                        left: '3%',
                                        right: '4%',
                                        bottom: '3%',
                                        containLabel: true
                                    },
                                    xAxis: {
                                        type: 'category',
                                        boundaryGap: false,
                                        data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                                    },
                                    yAxis: {
                                        type: 'value',
                                        //data: ['10%','20%','30%','40%','50%','60%','70%','80%','90%','100%']

                                    },
                                    series: [
                                        {
                                            name:'销量(元)',
                                            type:'line',
                                            stack: '总销量',
											areaStyle: {normal: {}},
                                            data:sales_data
                                        }
                                    ]
                                };


                    // 使用刚指定的配置项和数据显示图表。
                    myChart2.setOption(option2);
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

});
