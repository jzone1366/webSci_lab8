/*$.get("/getLangObject", success, "json");
function success(langs){
	console.log(langs);
	var data1 = [
		{
			value: langs[0],
			color:"#E60000"
		},
		{
			value: langs[1],
			color: "#E0E4CC"
		},
		{
			value: langs[2],
			color: "#69D2E7"
		},
		{
			value: langs[3],
			color: "#1FCF00"
		},
		{
			value: langs[4],
			color: "#FF33FC"
		}
	]
	var chart1= $("#langChart").get(0).getContext("2d");
	var langChart = new Chart(chart1).Pie(data1);
}

$.get("/getHashObject", success, "json");
function success(hashes){
	console.log(hashes);
	var data2 = {
		labels : ["yes", "no"],
		datasets : [
		{
			fillColor : "rgba(220, 220, 220, 0.5)",
			strokeColor : "rgba(220, 220, 220, 1)",
			pointColor : "rgba(220, 220, 220, 1)",
			pointStrokeColor: "#fff",
			data : hashes
		}]
	}
	var chart2 = $("#hashChart").get(0).getContext("2d");
	var hashChart = new Chart(chart2).Bar(data2);
}*/

var data3 = {
	labels : ["January","February","March","April","May","June","July"],
	datasets : [
		{
			fillColor : "rgba(220,220,220,0.5)",
			strokeColor : "rgba(220,220,220,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			data : [65,59,90,81,56,55,40]
		}
	]
}
var chart3 = $("#timeChart").get(0).getContext("2d");
var hashChart = new Chart(chart3).Line(data3);