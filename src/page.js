import {addProjectButton, loadProjectPage} from "./domHandler";
import Project from "./project";
import ToDo from "./todo";

function Page (){
    let projectList = [];

    const addProject = (project) => {
        projectList.push(project);
        addProjectButton(project);
    }

    const load = () => {

        //starting page
        const project1 = Project("PROJECT 1")
        const todo1 = ToDo('todo1', 'alalala', 1222, 'asas');
        const todo2 = ToDo('todo2', 'alalala', 1222, 'asas');
        project1.addToDo(todo1);
        project1.addToDo(todo2);
        addProject(project1);
        addProject(Project("PROJECT 2"));
        loadProjectPage(projectList[0]);
    }

    return {
        load
    }
}

export default Page;