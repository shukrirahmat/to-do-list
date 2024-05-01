function ToDo(title, dueDate, priority, description) {

    let checklist = false;
    let id;

    const getTitle = () => title;
    const getDate = () => dueDate;
    const getId = () => id;
    const setId = (newId) => {id = newId};

    function getPriority() {
        return priority;
    }
    
    return {getTitle, getId, setId, getDate, getPriority};
}
export default ToDo;