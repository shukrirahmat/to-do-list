import { UpdateProjectDom } from "./dom";

let projectList = [];

function addProject(project) {
    projectList.push(project);
}

function removeProject(index) {
    projectList.splice(index, 1);
}

export {addProject, projectList, removeProject};