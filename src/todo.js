import { isToday , differenceInCalendarDays, format} from "date-fns";

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
    const setCheck = (newCheck) => {check = newCheck}
    
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

    function getState() {
        return {
            title: getTitle(),
            dueDate: format(getDate(), 'yyyy-MM-dd'),
            priority: getPriority(),
            description: getDescription(),
            check: getCheck(),
            id: getId()
        }
    }



    return {
        getTitle,
        getId,
        setId,
        getDate,
        getPriority,
        getDescription,
        getCheck,
        setCheck,
        toggleCheck,
        edit,
        isOverdue,
        isToDoToday,
        isInAWeek,
        isInAMonth,
        getState
    };
}
export default ToDo;