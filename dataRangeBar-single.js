/* 	function of timeset , time range choose for all
			Created by  cpp   @2016-11-11
	how to use :
            1.in your html file .
				<link rel='stylesheet' type='text/css' href="site_media/css/bootstrap-datetimepicker-2.0/bootstrap-datetimepicker.min.css" media="screen"/>
				<script type="text/javascript" src="/site_media/js/dateRangeBar.js"></script>
				<script type="text/javascript" src="/site_media/js/bootstrap-datetimepicker-2.0/bootstrap-datetimepicker-2.0.js"></script>
				<div id="dateRangeBar_all" style="height: 80px;margin-right:50px"></div>
			2.In your js file .			
				a.Initialization
					$(function (){
					var dateRangeBarOptions = {
						submitFunc: "get_history_data()",
						timeFormat : "yyyy-mm-dd hh:ii",			
						defaultOffset :{
									'unit':"d",
									'startTime': -3,
									'endTime': 0,
									'timezoneOffSetHours': pst_offset_hours()+1,
						} ,
						defaultSingleBar:false,
						defaultStartTime: null,	
						defaultEndTime: null,
						fixedTimeArray: [1,2,3,7,-1],
						//warning:dateRangeBar's startDate is time now (UTC).
						//-1 in above arry means button "all" (from 1995.09.04 when ebay was established), if you don't want button "all", prase ;
					};	
				$("#dateRangeBar_all").dbboxDateRangeBar(dateRangeBarOptions);
				})
				b.get time data from the datetimepicker tables
				    Befor you found your function : get_history_data,you need to get start_time and end_time by using:
					    $("#dateRangeBar_all").getStartTime();
						$("#dateRangeBar_all").getEndTime();
				c.Reset button (*important)
					When you have finished get data from the server ,you need to reset our button by using "$("#dateRangeBar_all").resetButton()".
					In db_conn_monitor_history.js ,you can see an example function : "get_history_data()".
*/

;(function( $, window, document,undefined ){
    $.fn.extend({
		dbboxDateRangeBar : function(Options_temp) {
			var Options = $.extend({},{
				submitFunc: "",
				loadOnReady: true,
				timeFormat : "yyyy-mm-dd ",	
				minView:0,
				defaultOffset :{
							'unit':"d",
							'startTime': -1 ,					
							'endTime': 0 ,
							'timezoneOffSetHours': 0,
				},
				defaultSingleBar:true,
				defaultStartTime: null,	
				fixedTimeArray: [30,60,90,180,365,-1],
			}, Options_temp);
			
			var MONTHS = [30,60,90,121,152,183,213,243,273,304,334,365];
			var ONEDAY = 1000*60*60*24*1;
			var ONEHOUR = 1000*60*60*1;
			var ONEMINUTE = 1000*60*1;		
			var functionName = Options.submitFunc;
			var timepick_format = Options.timeFormat;
			var timepick_minview = Options.minView;
			var timepick_params = Options.fixedTimeArray;
			if(!Options.defaultStartTime){
				var defaultEndTime_temp = new Date(new Date().getTime() + Options.defaultOffset['timezoneOffSetHours']*ONEHOUR + Options.defaultOffset['startTime']*ONEDAY);
			}else{
				var defaultEndTime_temp = new Date(new Date(Options.defaultStartTime).getTime()); 
			}
			$(this).empty();
			var tem_timeRangeContainer = 			
					 '		<div class="btn-group">'
					+'				<div class="datepicket" style="float:right;height:30px">'
					+'					<div  style="float:left;">'
					+'						<div class="input-prepend input-append date start_time_container ">	'
					+'						<span class="add-on">Date</span>	'								
					+'						<input class="dayDateRangeBar" data-format="yyyy-MM-dd hh:ii" type="text" class="input-medium" style="height:20px;width:120px;"/>'
					+'							<span class="add-on">'
					+'						<i class="icon-th"></i>'
					+'							</span>'
					+'						</div>'
					+'					</div>'
					+'					<div class = "time_range_submit_container" style ="float:left; height:90px; " >'
					+'						<button type = "button" class = "selectDraw btn btn-primary " style="margin-left:10px" >Submit</button>'
					+'					</div>'								
					+'				</div>'
					+'		</div> '
			$(this).append(tem_timeRangeContainer);
			var start_Time = $(this).find(".start_time_container");
			var submit_button = $(this).find("button");	
			//Second part : timepicker settings.
			var range_day_time = start_Time.datetimepicker({
			  weekStart: 1,
			  todayBtn:  1,
			  autoclose: 1,
			  todayHighlight: 1,
			  startView: 2,
			  forceParse: true,
			  format: timepick_format,
			  startDate:'1995-09-04',
			  pickTime: false,
			  pickerPosition: "bottom-left",
			  minuteStep:15,
			  minView:timepick_minview,
				});
			range_day_time.datetimepicker('setDate', defaultEndTime_temp);		
			//Third part : html show for button we just created. 
			if(Options.loadOnReady){
				eval(functionName);
			}
			submit_button.on('click',function(){
				var btn = $(this);
				submit_button.each(function() {
					$(this).text("loading");
					$(this).attr({"disabled":"disabled"});
				});
				eval(functionName);		
			}); 
			return {
				loading: function(){
					var time_range_submit = $(this).find(".time_range_submit_container button");
					//Attention :U can only use this function alone after u've finished adding all the buttons into the container(line 154).Or u'll not get the object of buttons. 
					var time_range_buttons = $(this).find(".time_range_buttons_container button");
					time_range_buttons.each(function() {
						$(this).attr('class', "btn btn-default");
						$(this).attr({"disabled":"disabled"});
						});	
					time_range_submit.each(function() {
						$(this).text("loading");
						$(this).attr({"disabled":"disabled"});
					});
				},
				setStartTime: function(defaultStartTime_temp) {
					return range_start_time.datetimepicker('setDate', defaultStartTime_temp);
				},
				setEndTime: function(defaultEndTime_temp) {
					var end_Time = $(this).find(".end_time_container");
					var range_end_time = end_Time.datetimepicker({
					  weekStart: 1,
					  todayBtn:  1,
					  autoclose: 1,
					  todayHighlight: 1,
					  startView: 2,
					  forceParse: true,
					  format: timepick_format,
					  startDate:'1995-09-05',
					  pickTime: false,
					  pickerPosition: "bottom-left",
					  minuteStep:15,
						});	
					return range_end_time.datetimepicker('setDate', defaultEndTime_temp);
				},
				getStartTime : function() {
					return $(this).find(".dayDateRangeBar").attr("value");
				},
				getEndTime   : function() {
					return $(this).find(".endTimeText").attr("value");
				},
				resetButton  : function() { 
					var buttons_of_time_range = $(this).find(".time_range_buttons_container button");
					var button_of_time_submit = $(this).find(".time_range_submit_container button");
					return 	buttons_of_time_range.each(function() {
								$(this).removeAttr("disabled");
								}),
							button_of_time_submit.each(function() {
								$(this).removeClass();
								$(this).attr('class', "btn btn-primary selectDraw");
								$(this).removeAttr("disabled");
								$(this).text("Submit");
								});
				},
			};		
		},
		loading: function(){
			var time_range_submit = $(this).find(".time_range_submit_container button");
			//Attention :U can only use this function alone after u've finished adding all the buttons into the container(line 154).Or u'll not get the object of buttons. 
			var time_range_buttons = $(this).find(".time_range_buttons_container button");
			time_range_buttons.each(function() {
				$(this).attr('class', "btn btn-default");
				$(this).attr({"disabled":"disabled"});
				});	
			time_range_submit.each(function() {
				$(this).text("loading");
				$(this).attr({"disabled":"disabled"});
			});
		},
		setStartTime: function(defaultStartTime_temp) {
			var start_Time = $(this).find(".start_time_container");
			var range_start_time = start_Time.datetimepicker({
			  weekStart: 1,
			  todayBtn:  1,
			  autoclose: 1,
			  todayHighlight: 1,
			  startView: 2,
			  forceParse: true,
			  format: timepick_format,
			  startDate:'1995-09-04',
			  pickTime: false,
			  pickerPosition: "bottom-left",
			  minuteStep:15,
				});
			return range_start_time.datetimepicker('setDate', defaultStartTime_temp);
		},
		setEndTime: function(defaultEndTime_temp) {
			var end_Time = $(this).find(".end_time_container");
			var range_end_time = end_Time.datetimepicker({
			  weekStart: 1,
			  todayBtn:  1,
			  autoclose: 1,
			  todayHighlight: 1,
			  startView: 2,
			  forceParse: true,
			  format: timepick_format,
			  startDate:'1995-09-05',
			  pickTime: false,
			  pickerPosition: "bottom-left",
			  minuteStep:15,
				});	
			return range_end_time.datetimepicker('setDate', defaultEndTime_temp);
		},

		getDayDate :   function() {			
			return $(this).find(".dayDateRangeBar").val();
		},
		pst_offset_hours   : function() {
			var tzoff = new Date().getTimezoneOffset();  //China= -480, PST = 480
			var offhour = tzoff/60 - 8; //Comparing to PST
			return offhour;
		},
		resetButton  : function() { 
			var buttons_of_time_range = $(this).find(".time_range_buttons_container button");
			var button_of_time_submit = $(this).find(".time_range_submit_container button");
			return 	buttons_of_time_range.each(function() {
						$(this).removeAttr("disabled");
						}),
					button_of_time_submit.each(function() {
						$(this).removeClass();
						$(this).attr('class', "btn btn-primary selectDraw");
						$(this).removeAttr("disabled");
						$(this).text("Submit");
						});
		},
	}); 
	
})( jQuery, window, document );
/*function of timeset , time range choose for all
			End by  cpp   @2016-11-11
*/