webSci_lab8
===========

Twitter Visualizations
----------------------

Using the twitter API tweets are read in and saved to MongoDB. There are 3 different visualizations and analytics.
+Timeline Chart
  +This chart updates every 20 seconds and shows the number of tweets collected in those 2 seconds. Pulls real time data from the API.
  +Displayed as a Line Chart. 
+Language Chart
  +This chart shows the percentage of tweets in a certain language to the overall number of tweets. 
  +Displayed as Pie Chart.
 +HashTag Chart
   +This chart shows the comparison between whether a tweet has a hashtag or not.
   +Displayed as bar chart.

The button for writing to MongoDB has been removed. This is because all of the tweets are streamed in real time and then inserted into the database. This is so that the timeline visualization will work since it uses real time updates. All the other buttons work. The JSON file is created from the current tweets in the database. The CSV file is created from the JSON file. Display tweets button pulls all the tweets from the database to display on the screen.

The twitter stream is instantiated immeadiately upon connection. Then streaming begins along with insertion into the database. Once 2000 tweets are written then the hashtag visualization array and the language visualization array are populated and logged. These arrays can now be used to populate the visualizatons. All of the styling is in app.css. Each page has it's own javascript page to pull the data using a get request from the server. Then parse the data and send it to Charts.js to display as a chart on the page. The Timeline chart page updates every 20 seconds to get the array that is saved on the server. This array is also updated to display how many tweets were collected every 20 seconds. Twitter Bootstrap is used to make the layout responsive and help with the navigation at the top of the page. 

References
----------
[Socket.io](http://socket.io/ "Socket.io")
[Nodejs.org](http://nodejs.org/ "Nodejs")
[getbootstrap.com](http://getbootstrap.com/ "Twitter Bootstrap")
[node-fs](http://nodejs.org/api/fs.html "Node Filesystem")
[json2csv module](https://github.com/zeMirco/json2csv "json2csv Module")
[expressjs.com](http://expressjs.com/ "ExpressJS")
[Christian Valheim Blog](http://christiankvalheim.com/ "chrisianvalheim")
[Chart.js](http://www.chartjs.org/ "chartjs.org")