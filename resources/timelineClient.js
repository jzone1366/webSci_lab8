/**
 * Set an interval to call the createTimeline function. 
 * This interval will refresh the timeline every 10secs to keep it up-to-date
 */
createTimeline();
setInterval(createTimeline, 10000);
/**
 * Make a get request to the server to get the timeline object. 
 * Parse the object to get the labels and values for the data. 
 * @return Create a line graph of tweets per 20secs. 
 */
function createTimeline(){
	$.get("/getTimelineObject", success, "json");
	labs = [];
	nums = [];
	function success(timeline){
		for(var i in timeline){
			labs.push(i*20);
			nums.push(timeline[i]);
		}
		var data3 = {
		labels : labs,
		datasets : [
			{
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				pointColor : "rgba(220,220,220,1)",
				pointStrokeColor : "#fff",
				data : nums
			}
		]
	}
	var chart3 = $("#timeChart").get(0).getContext("2d");
	var hashChart = new Chart(chart3).Line(data3);
	}
}