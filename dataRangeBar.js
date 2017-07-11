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
							'startTime': 0,					
							'endTime': 0 ,
							'timezoneOffSetHours': 0,
				},
				defaultSingleBar:false,
				defaultStartTime: null,	
				defaultEndTime: null,
				fixedTimeArray: [30,60,90,180,365,-1],
			}, Options_temp);
            
            var ONEDAY = 1000*60*60*24*1;
            var ONEHOUR = 1000*60*60*1;
            var ONEMINUTE = 1000*60*1;	
			if(!Options["defaultSingleBar"]){
				$(this).empty();
				var ONEMONTH = 30*1000*60*60*24*1;		
				var functionName = Options.submitFunc;
				var timepick_format = Options.timeFormat;
				var timepick_minview = Options.minView;					
				var timepick_params = Options.fixedTimeArray;
				var tem_timeRangeContainer = 			
						 '		<div class="btn-group">'
						+'					<div class="datepicket" style="float:right;height:30px">'
						+'					<div  style="float:left;">'
						+'						<div class="input-prepend input-append date start_time_container ">	'
						+'						<span class="add-on">Start</span>	'								
						+'						<input class="startTimeText" data-format="yyyy-MM-dd hh:ii" type="text" class="input-medium" style="height:20px;width:120px;"/>'
						+'							<span class="add-on">'
						+'						<i class="icon-th"></i>'
						+'							</span>'
						+'						</div>'
						+'					</div>'
						+'					<div style="float:left; margin-left:10px;">'
						+'						<div class="input-prepend input-append date end_time_container">'
						+'						<span class = "add-on">End</span>	'							
						+'						<input class = "endTimeText" value="" data-format="yyyy-MM-dd hh:ii" type="text" class="input-medium" style="height:20px;width:120px;"/>'
						+'						<span class = "add-on">'
						+'						<i class = "icon-th"></i>'
						+'						</span>'
						+'						</div>'
						+'					</div>'
						+'					<div class = "time_range_submit_container" style ="float:left; " >'
						+'						<button type = "button" class = "selectDraw btn btn-primary " style="margin-left:10px" >Submit</button>'
						+'					</div>'
						+'					<div class="btn-group  time_range_buttons_container"  style="margin-left:10px; padding-bottom:8px;" >'
						+'						   <!--  put time range-chosen btn here -->'
						+'					</div>'									
						+'				</div>'
						+'		</div> '
				$(this).append(tem_timeRangeContainer);
				var start_Time = $(this).find(".start_time_container");
				var end_Time = $(this).find(".end_time_container");
				var time_range_buttons_container = $(this).find(".time_range_buttons_container");	
				var time_range_buttons = $(this).find(".time_range_buttons_container button");
				//Second part : timepicker settings.
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
				  minView:timepick_minview,
					});
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
				  minView:timepick_minview,
					});			
                timeSize(Options.defaultOffset['unit']);

				if(!Options.defaultStartTime&&Options.defaultEndTime){
					var defaultStartTime_temp = new Date(new Date(Options.defaultEndTime).getTime() + Options.defaultOffset['startTime']*time_size - Options.defaultOffset['endTime']*time_size); 
					var defaultEndTime_temp = new Date(new Date(Options.defaultEndTime).getTime()); 	
				}
				if(Options.defaultStartTime&&!Options.defaultEndTime){
					var defaultEndTime_temp = new Date(new Date(Options.defaultStartTime).getTime() - Options.defaultOffset['startTime']*time_size + Options.defaultOffset['endTime']*time_size); 
					var defaultStartTime_temp = new Date(Options.defaultStartTime); 				
				}
				if(Options.defaultStartTime&&Options.defaultEndTime){
					var defaultStartTime_temp = new Date(new Date(Options.defaultStartTime).getTime()); 
					var defaultEndTime_temp = new Date(new Date(Options.defaultEndTime).getTime());
				}
				if(!Options.defaultStartTime&&!Options.defaultEndTime){
					var defaultStartTime_temp = new Date(new Date().getTime() + Options.defaultOffset['startTime']*time_size + Options.defaultOffset['timezoneOffSetHours']*ONEHOUR); 
					var defaultEndTime_temp = new Date(new Date().getTime() + Options.defaultOffset['endTime']*time_size + Options.defaultOffset['timezoneOffSetHours']*ONEHOUR); 	
				}
				range_start_time.datetimepicker('setDate', defaultStartTime_temp);	
				range_end_time.datetimepicker('setDate', defaultEndTime_temp);	
				//Third part : html show for button we just created. 
				var tem_timeRangeBtnContainer ;
				for(i=0;i<=timepick_params.length-1;i++){		
					if(timepick_params[i] == -1){
						tem_timeRangeBtnContainer += ' <button type="button" class="btn btn-default" >all</button>';
					}else{
						tem_timeRangeBtnContainer += ' <button type="button" class="btn btn-default" >'+timepick_params[i]+Options.defaultOffset['unit']+'</button>';
					}
				}
				time_range_buttons_container.empty();
				time_range_buttons_container.append(tem_timeRangeBtnContainer);	
				var time_range_submit = $(this).find(".time_range_submit_container button");
				var time_range_buttons = $(this).find(".time_range_buttons_container button");
				var button_label = false;
				var flag_buttons_range = null;
				time_range_submit.on('click',function(){
					time_range_submit.each(function() {
						$(this).text("loading");
						$(this).attr({"disabled":"disabled"});
					});
					time_range_buttons.each(function() {
						$(this).attr('class', "btn btn-default");
						$(this).attr({"disabled":"disabled"});
					});
					eval(functionName);		
				}); 
				time_range_buttons.on('click',function(){
					button_label = $(this).text();
					if(button_label){
						var set_all_startdate = new Date(1995,8,4).getTime();     
						var duration = parseInt(button_label);
						defaultEndTime_temp = new Date(new Date().getTime() + Options.defaultOffset['endTime']*time_size + Options.defaultOffset['timezoneOffSetHours']*ONEHOUR)
						if(Options.defaultOffset['unit']=="M"){
							  //var day_milliseconds = defaultEndTime_temp.getTime() - time_size*MONTHS[duration-1];
							  var day_milliseconds = defaultEndTime_temp.getTime() - time_size*duration;
						}else
						{
							  //var day_milliseconds = defaultEndTime_temp.getTime() - time_size*duration;
							  var day_milliseconds = defaultEndTime_temp.getTime() - time_size*duration;
						}  
						defaultStartTime_temp.setTime(day_milliseconds);
						if(button_label == "all" || button_label == "none"){
							if(timepick_params[timepick_params.length-1] == -1){ defaultStartTime_temp.setTime(set_all_startdate);}
							if(timepick_params[timepick_params.length-1] == -2){}
						}
				//Fourth part : time set after we've chosen time range.
						range_start_time.datetimepicker('setDate', defaultStartTime_temp);
						range_end_time.datetimepicker('setDate', defaultEndTime_temp);	
					}
					time_range_submit.click();
				});	
				if(Options.loadOnReady){
					time_range_submit.click();
				}
			}	
			else{
				var MONTHS = [30,60,90,121,152,183,213,243,273,304,334,365];	
				var functionName = Options.submitFunc;
				var timepick_format = Options.timeFormat;
				var timepick_minview = Options.minView;
				var timepick_params = Options.fixedTimeArray;
                				if(Options.defaultOffset['unit']=="m"){
					time_size = ONEMINUTE;		
				}		
                timeSize(Options.defaultOffset['unit']);
				if(!Options.defaultEndTime){
					var defaultEndTime_temp = new Date(new Date().getTime() + Options.defaultOffset['endTime']*time_size+ Options.defaultOffset['timezoneOffSetHours']*ONEHOUR);
				}else{
					var defaultEndTime_temp = new Date(new Date(Options.defaultEndTime).getTime()); 
				}
				$(this).empty();
				var tem_timeRangeContainer = 			
						 '		<div class="btn-group">'
						+'				<div class="datepicket" style="float:right;height:30px">'
						+'					<div  style="float:left;">'
						+'						<div class="input-prepend input-append date start_time_container ">	'
						+'						<span class="add-on">Date</span>	'								
						+'						<input class="dayDateRangeBar" data-format="yyyy-MM-dd" type="text" class="input-medium" style="height:20px;width:120px;"/>'
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
			}
            function timeSize(timeUnit){
                
				if(timeUnit=="m"){
					time_size = ONEMINUTE;		
				}
				if(timeUnit=="h"){
					time_size = ONEHOUR;			
				}
				if(timeUnit=="d"){
					time_size = ONEDAY;				
				}
				if(timeUnit=="M"){			
					time_size = ONEMONTH;  				
				}
            }
			return {
				time_range_buttons : time_range_buttons,
				time_range_submit : time_range_submit,
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
					return $(this).find(".startTimeText").attr("value");
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
		getStartTime : function() {			
			return $(this).find(".startTimeText").val();
		},
		getEndTime   : function() {
			return $(this).find(".endTimeText").val();
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
