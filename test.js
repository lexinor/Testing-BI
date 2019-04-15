var test = require('./classes/Tester.js');
var software_release = require('./classes/Software_Release.js');
var software = require('./classes/Software.js');

var direBonjour = () => {
    var tester = new test("Certain","Maxime");
    console.log("Last Name : " + tester.lastName);
    console.log("First Name : " + tester.firstName);
};

var direBonsoir = () => {
    var tester = new software_release("1","1", new software(1, "nomsoft", "desc", 2016-12-12) );
    console.log("Last Name : "+ tester.getVersion());
};

exports.direBonjour = direBonjour;
exports.direBonjour = direBonsoir();