function Project(name) {

    let id;

    const setId = (newId) => {id = newId};
    const getId = () => id; 
    const getName = () => name;

    return {getName, setId, getId};
}

export default Project;