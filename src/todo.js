function ToDo(title, dueDate, priority, description) {

    let check = false;
    let id;

    const getTitle = () => title;
    const getDate = () => dueDate;
    const getPriority = () => priority;
    const getDescription = () => description;
    const getId = () => id;
    const getCheck = () => check;
    const setId = (newId) => { id = newId };
    
    function toggleCheck(checkbox) {
        if (checkbox.checked) {
            check = true;
        } else {
            check = false;
        }
    }

    function edit(newtodo) {
        title = newtodo.getTitle();
        dueDate = newtodo.getDate();
        priority = newtodo.getPriority();
        description = newtodo.getDescription();
    }



    return {
        getTitle,
        getId,
        setId,
        getDate,
        getPriority,
        getDescription,
        getCheck,
        toggleCheck,
        edit
    };
}
export default ToDo;