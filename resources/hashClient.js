/**
 * Get request for the Hashtag object.
 * This object will be used to create the hashtag visualization.
 */
$.get("/getHashObject", success, "json");
function success(hashes){
	console.log(hashes);
	var data2 = {
		labels : ["Hashtags", "No Hashtags"],
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
}