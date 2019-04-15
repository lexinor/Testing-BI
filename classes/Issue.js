var method = Issue.prototype;

function Issue(id, name, description, priority, severity, statut) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.severity = severity;
    this.statut = statut;
}


method.setName = (name) => {
    this.name = name;
}

method.setDescription = (description) => {
    this.description = description;
}

method.setPriority = (priority) => {
    this.priority = priority;
}

method.setSeverity = (severity) => {
    this.severity = severity;
}

method.setStatut = (statut) => {
    this.statut = statut;
}

method.getId = () => {
    return this.id;
}

method.getName = () => {
    return this.name;
}

method.getDescription = () => {
    return this.description;
}

method.getPriority = () => {
    return this.priority;
}

method.getSeverity = () => {
    return this.severity;
}

method.getStatut = () => {
    return this.statut;
}

module.exports = Tester;