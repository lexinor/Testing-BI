var method = Tester.prototype;

function Tester(lastName, firstName) {
    this.lastName = lastName;
    this.firstName = firstName;
}

method.getLastName = function () {
    return this.lastName;
}

method.getFirstName = function () {
    return this.firstName;
}

module.exports = Tester;