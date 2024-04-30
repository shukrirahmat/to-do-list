import pm from "./projectManager";
import Project from "./project";

function Dom() {

    const addprojectbtn = document.querySelector('#addprojectbtn');
    const projectcontainer = document.querySelector('.projectcontainer');
    const projectdialog = document.querySelector('#projectdialog');
    const projectform = document.querySelector('#projectform');
    const projectnameinput = document.querySelector('#projectform input')
    const projectcancel = document.querySelector('#projectform .cancel');
    const projectrename = document.querySelector('#projectrename');
    const projectdelete = document.querySelector('#projectdelete');

    const initialSetup = () => {
        dialogSetup();
        addprojectbtn.addEventListener('click', () => {
            projectdialog.showModal();
        })
    }

    const dialogSetup = () => {
        projectform.addEventListener('submit', (e) => {
            const name = projectnameinput.value;
            const newproject = Project(name);
            pm.addProject(newproject);
            updateProjectDom();
            e.preventDefault();
            projectdialog.close();
            projectnameinput.value = "";
        })

        projectcancel.addEventListener('click', (e) => {
            e.preventDefault();
            projectdialog.close();
            projectnameinput.value = "";
        })
    }

    const updateProjectDom = () => {

        while (projectcontainer.firstChild) {
            projectcontainer.firstChild.remove();
        }

        pm.getProjectList().forEach(
            function (project, index) {
                project.setId(index);
                const div = document.createElement('div');

                const projectbutton = createBtn(project.getName())


                const renamebutton = createBtn("RENAME");
                renamebutton.addEventListener('click', () => {
                    createRenameForm(index);
                    projectrename.showModal();
                })

                const deletebutton = createBtn("DELETE");
                deletebutton.addEventListener('click', function () {
                    createDeleteForm(index);
                    projectdelete.showModal();
                })

                div.appendChild(projectbutton);
                div.appendChild(renamebutton);
                div.appendChild(deletebutton);
                projectcontainer.appendChild(div);

            }
        )
    }

    const createDeleteForm = (index) => {
        const previousdiv = projectdelete.querySelector('div');
        previousdiv.remove();

        const project = pm.getProjectList()[index];
        const text = `Delete project "${project.getName()}"?`;

        const outsidediv = document.createElement('div');
        const p = document.createElement('p');
        p.textContent = text;
        const innerdiv = document.createElement('div');
        const yes = createBtn("YES");
        const no = createBtn("NO");

        innerdiv.appendChild(yes);
        innerdiv.appendChild(no);
        outsidediv.appendChild(p);
        outsidediv.appendChild(innerdiv);
        projectdelete.appendChild(outsidediv);

        yes.addEventListener('click', () => {
            pm.removeProject(index);
            updateProjectDom();
            projectdelete.close();
        })
        no.addEventListener('click', () => {
            projectdelete.close();
        })
    }

    const createRenameForm = (index) => {
        const previousform = projectrename.querySelector('form');
        previousform.remove();

        const newform = document.createElement('form');
        const input = document.createElement('input');
        const div = document.createElement('div');
        const confirm = createBtn("RENAME");
        const cancel = createBtn("CANCEL");

        div.appendChild(confirm);
        div.appendChild(cancel);
        newform.appendChild(input);
        newform.appendChild(div);
        projectrename.appendChild(newform);

        const project = pm.getProjectList()[index];

        input.setAttribute('type', 'text');
        input.setAttribute('required', "");
        input.value = project.getName();
        newform.addEventListener('submit', (e) => {
            project.setName(input.value);
            updateProjectDom();
            e.preventDefault();
            projectrename.close();
        })
        cancel.addEventListener('click', (e) => {
            e.preventDefault();
            projectrename.close();
        })
    }

    return {
        initialSetup
    }
}

function createBtn(text) {
    const btn = document.createElement('button');
    btn.textContent = text;
    return btn;
}

const dom = Dom();

export default dom;