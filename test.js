var test = require('./classes/Tester.js');

var direBonjour = () => {
    var tester = new test("Certain","Maxime");
    console.log("Last Name : " + tester.lastName);
    console.log("First Name : " + tester.firstName);
}

exports.direBonjour = direBonjour;