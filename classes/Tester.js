var method = Tester.prototype;

function Tester(lastName, firstName, mail) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.mail = mail;
}


method.setLastName = (lastName) => {
    this.lastName = lastName;
}

method.setFirstName = (firstName) => {
    this.firstName = firstName;
}

method.setMail = (mail) => {
    this.mail = mail;
}

method.getLastName = () => {
    return this.lastName;
}

method.getFirstName = () => {
    return this.firstName;
}

method.getMail = () => {
    return this.mail;
}

module.exports = Tester;