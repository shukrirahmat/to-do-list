import { addProject, projectList, removeProject } from "./projectHandler";
import Project from "./project";

const addprojectbtn = document.querySelector('#addprojectbtn');
const projectcontainer = document.querySelector('.projectcontainer');
const leftbottom = document.querySelector('.leftbottom');

function domInitialSetup() {
    addprojectbtn.addEventListener('click', callProjectForm)
}

function callProjectForm() {
    addprojectbtn.remove();
    const formdiv = document.createElement('div');
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.classList.add('projectnameinput');
    const yes = document.createElement('button');
    yes.textContent = "ADD";
    const no = document.createElement('button');
    no.textContent = "X";

    formdiv.appendChild(input);
    formdiv.appendChild(yes);
    formdiv.appendChild(no);
    leftbottom.appendChild(formdiv);

    yes.addEventListener('click', function () {
        if (input.value != "") {
            const newproject = Project(input.value)
            addProject(newproject);
            UpdateProjectDom()
            formdiv.remove();
            leftbottom.appendChild(addprojectbtn);
        }
    })
    no.addEventListener('click', function () {
        formdiv.remove();
        leftbottom.appendChild(addprojectbtn);
    })
}

function UpdateProjectDom() {

    while (projectcontainer.firstChild) {
        projectcontainer.firstChild.remove();
    }

    projectList.forEach(
        function (project, index) {
            project.setId(index);
            const div = document.createElement('div');
            const projectbutton = document.createElement('button');
            projectbutton.textContent = project.getName();

            const deletebutton = document.createElement('button');
            deletebutton.textContent = "DEL";
            deletebutton.addEventListener('click', function () {
                removeProject(index);
                UpdateProjectDom();
            })

            div.appendChild(projectbutton);
            div.appendChild(deletebutton);
            projectcontainer.appendChild(div);

        }
    )
}

export { domInitialSetup}