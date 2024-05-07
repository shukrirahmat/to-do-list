function ProjectManager() {

    let projectList = [];

    const getProjectList = () => projectList;
    const setProjectList = (list) => {projectList = list}

    const addProject = (project) => {
        projectList.push(project);
    }

    const removeProject = (index) => {
        projectList.splice(index, 1);
    }

    return {getProjectList, setProjectList, addProject, removeProject}
}

const pm = ProjectManager();

export default pm;