function Project(name) {

    let id;

    const setId = (newId) => {id = newId};
    const getId = () => id; 
    const getName = () => name;
    const setName = (newname) => {name = newname}

    return {getName, setId, getId, setName};
}

export default Project;