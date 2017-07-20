var http = require("http");

var i = 0;

setInterval(function() {
  var options = {
    method: "POST",
    hostname: "localhost",
    port: 3000,
    path: "/transaction",
    headers: {
      "content-type": "application/json"
    }
  };
  try {
    var req = http.request(options, function(res) {
      var chunks = [];

      res.on("data", function(chunk) {
        chunks.push(chunk);
      });

      res.on("end", function() {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });
    });
    req.write(
      JSON.stringify({
        startNumber: i,
        endNumber: 2,
        name: "Yunseop"
      })
    );
    req.end();
    i++;
  } catch (error) {
    console.error(error);
  }
}, 990);
