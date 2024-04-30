function Project(name) {

    let id;
    let todoList = [];

    const setId = (newId) => {id = newId};
    const getId = () => id; 
    const getName = () => name;
    const setName = (newname) => {name = newname};
    const getToDoList = () => todoList;
    const addToDo = (todo) => {
        todoList.push(todo);
    }

    return {getName, setId, getId, setName, getToDoList, addToDo};
}

export default Project;