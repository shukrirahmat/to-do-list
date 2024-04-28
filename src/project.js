function Project(name) {

    let todos = [];

    const getName = () => name;
    const setName = (newName) => {name = newName};
    const getToDo = () => todos;
    const addToDo = (toDo) => {
        todos.push(toDo);
    } 
    const removeTodo = (todoIndex) => {
        todos.splice(todoIndex, 1);
    }

    return {getName, setName, getToDo, addToDo, removeTodo}
}

export default Project;