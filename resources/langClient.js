/**
 * Get request for the lang object that is on the server.
 * This object will be used to create the language visualization. 
 */
$.get("/getLangObject", success, "json");
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