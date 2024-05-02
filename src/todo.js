function ToDo(title, dueDate, priority, description) {

    let checklist = false;
    let id;

    const getTitle = () => title;
    const getDate = () => dueDate;
    const getPriority = () => priority;
    const getDescription = () => description;
    const getId = () => id;
    const setId = (newId) => {id = newId};

    
    return {getTitle, getId, setId, getDate, getPriority, getDescription};
}
export default ToDo;