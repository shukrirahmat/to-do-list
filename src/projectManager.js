function ProjectManager() {

    let projectList = [];

    const getProjectList = () => projectList;

    const addProject = (project) => {
        projectList.push(project);
    }

    const removeProject = (index) => {
        projectList.splice(index, 1);
    }

    return {getProjectList, addProject, removeProject}
}

const pm = ProjectManager();


export default pm;