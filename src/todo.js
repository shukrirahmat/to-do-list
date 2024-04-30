function ToDo(title, dueDate, priority, description) {

    let checklist = false;
    let id;

    const getTitle = () => title;
    const getId = () => id;
    const setId = (newId) => {id = newId};
    
    return {getTitle, getId, setId};
}
export default ToDo;