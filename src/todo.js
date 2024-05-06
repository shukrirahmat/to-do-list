import { isToday , differenceInCalendarDays} from "date-fns";

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

    function isOverdue() {
        let difference = differenceInCalendarDays(dueDate, new Date());
        return difference <= -1
    }

    function isToDoToday() {
        return isToday(dueDate);
    }

    function isInAWeek() {
        let difference = differenceInCalendarDays(dueDate, new Date());
        return ((difference < 8) && (!isOverdue()));
    }

    function isInAMonth() {
        let difference = differenceInCalendarDays(dueDate, new Date());
        return ((difference < 31) && (!isOverdue()));
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
        edit,
        isOverdue,
        isToDoToday,
        isInAWeek,
        isInAMonth
    };
}
export default ToDo;