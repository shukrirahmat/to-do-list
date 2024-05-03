function Project(name) {

    let id;
    let todoList = [];

    const setId = (newId) => { id = newId };
    const getId = () => id;
    const getName = () => name;
    const setName = (newname) => { name = newname };
    const getToDoList = () => todoList;
    const addToDo = (todo) => {
        todoList.push(todo);
    }
    const removeToDo = (todo) => {
        todoList.splice(todo.getId(), 1);
    }

    return {
        getName,
        setId,
        getId,
        setName,
        getToDoList,
        addToDo,
        removeToDo
    };
}

export default Project;