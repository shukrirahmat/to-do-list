function ToDo(title, description, dueDate, priority) {
    let check = false;
    let note = false;
    
    const getTitle = () => title;
    const getdescription = () => description;
    const getDueDate = () => dueDate;
    const getPriority = () => priority;
    const getCheck = () => check;
    const getNote = () => note;

    const edit = (todo) => {
        title = todo.getTitle();
        description = todo.getdescription();
        dueDate = todo.getDueDate();
        priority = todo.getPriority();
    }

    const toggleCheck = () => {
        if (check) {
            check = false;
        } else {
            check = true;
        }
    }

    const addNote = (text) => {
        note = text;
    }
    
    return {
        getTitle,
        getdescription,
        getDueDate,
        getPriority,
        getCheck,
        getNote,
        edit,
        toggleCheck,
        addNote
    }
}

export default ToDo;