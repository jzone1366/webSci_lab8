$.get("/getLangObject", success, "json");
function success(langs){
	console.log(langs);
	var labs = [];
	var vals = [];
	for(lang in langs){
		labs.push(lang);
		vals.push(langs[lang]);
	}
	var data = {
		labels : labs,
		datasets : [
		{
			fillColor : "rgba(220, 220, 220, 0.5)",
			strokeColor : "rgba(220, 220, 220, 1)",
			pointColor : "rgba(220, 220, 220, 1)",
			pointStrokeColor: "#fff",
			data : vals
		}]
	}
	var ctx = $("#langChart").get(0).getContext("2d");
	var langChart = new Chart(ctx).Bar(data);
}