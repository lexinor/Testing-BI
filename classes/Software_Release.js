var method = Software_Release.prototype;

function Software_Release(id, version, software) {
    this.id = id;
    this.version = version;
    this.software = software;
}

method.getId = function () {
    return this.id;
};

method.getVersion = () => {
    return this.firstName;
};

method.setVersion= (newName) => {
    this.name = newName;
};

method.getSoftware = () => {
    return this.software;
};

method.setSoftware = (software) => {
    this.software = software;
};


module.exports = Software_Release;