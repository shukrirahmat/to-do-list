import Project from "./project";
import ToDo from "./todo";

function StorageHandler() {

    function isEmpty() {
        return (localStorage.length < 1);
    }

    function load() {
        const projectList = [];
        const toLoad = JSON.parse(localStorage.getItem("projects"));

        toLoad.forEach(
            function (p) {
                const project = Project(p.name);
                project.setId(p.id);
                p.todolist.forEach(
                    function(t) {
                        const todo = ToDo(t.title, t.dueDate, t.priority, t.description);
                        todo.setId(t.id);
                        todo.setCheck(t.check);
                        project.addToDo(todo);
                    }
                )
                projectList.push(project);
            }
        )

        return projectList;
    }

    function save(list) {

        const toSave = []

        list.forEach(
            function (project) {
                const todolist = [];
                project.getToDoList().forEach(
                    function (todo) {
                        todolist.push(todo.getState());
                    }
                )
                toSave.push({
                    name: project.getName(),
                    id: project.getId(),
                    todolist
                })
            }
        )

        console.log(toSave);
        localStorage.setItem("projects", JSON.stringify(toSave));
    }

    return { isEmpty, load, save }
}

const storagehandler = StorageHandler();

export default storagehandler;