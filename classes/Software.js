var method = Software.prototype;

function Software(id, name ,description, entryDate) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.entryDate = entryDate;
}

method.getId = function () {
    return this.id;
};

method.getName = () => {
    return this.firstName;
};

method.setName = (newName) => {
   this.name = newName;
};

method.getDescription = () => {
    return this.description;
};

method.setDescription = (description) => {
    this.description = description;
};

method.getEntryDate = () => {
    return this.entryDate;
};

method.setEntryDate = (entryDate) => {
    this.entryDate = entryDate;
};

module.exports = Software;