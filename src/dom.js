import pm from "./projectManager";
import Project from "./project";
import ToDo from "./todo";

function Dom() {

    const addprojectbtn = document.querySelector('#addprojectbtn');
    const projectcontainer = document.querySelector('.projectcontainer');
    const projectdialog = document.querySelector('#projectdialog');
    const projectform = document.querySelector('#projectform');
    const projectnameinput = document.querySelector('#projectform input')
    const projectcancel = document.querySelector('#projectform .cancel');
    const projectrename = document.querySelector('#projectrename');
    const projectdelete = document.querySelector('#projectdelete');
    const maincontent = document.querySelector('#maincontent');
    const tododialog = document.querySelector('#tododialog');

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

                const projectbutton = createBtn(project.getName());
                projectbutton.addEventListener('click', () => {
                    loadProjectPage(index);
                })

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

    const clearProjectPage = () => {
        while (maincontent.firstChild) {
            maincontent.firstChild.remove();
        }
    }

    const loadProjectPage = (index) => {
        clearProjectPage();

        const maindiv = document.createElement('div');
        const todocontainer = document.createElement('div');
        const project = pm.getProjectList()[index];
        const todolist = project.getToDoList();
        todolist.forEach(
            function(todo, index) {
                const div = document.createElement('div');
                div.textContent = todo.getTitle();
                todo.setId(index);
                todocontainer.appendChild(div);
            }
        )

        const addtodobtn = createBtn("Add New Task");
        addtodobtn.addEventListener('click', () => {
            createToDoForm(index);
            tododialog.showModal();
        })

        maindiv.appendChild(todocontainer);
        maindiv.appendChild(addtodobtn);
        maincontent.appendChild(maindiv);
    }

    const createToDoForm = (index) => {

        const form = tododialog.querySelector('form');
        const title = form.querySelector('#title');
        const dueDate = form.querySelector('#duedate');
        const priority = form.querySelector('#priority');
        const description = form.querySelector('#description');
        const previousbuttons = form.querySelector('.submitbtn');
        previousbuttons.remove();

        const newbuttons = document.createElement('div');
        newbuttons.classList.add('submitbtn');
        const addbtn = createBtn("ADD");
        const cancel = createBtn("CANCEL");
        newbuttons.appendChild(addbtn);
        newbuttons.appendChild(cancel);
        form.appendChild(newbuttons);

        form.addEventListener('submit', (e) => {
            const todo = ToDo(title.value, dueDate.value, priority.value, description.value);
            const project = pm.getProjectList()[index];
            project.addToDo(todo);
            e.preventDefault();
            tododialog.close();
            form.reset();
            loadProjectPage(index);
        })
        cancel.addEventListener('click', (e) => {
            e.preventDefault();
            tododialog.close();
            form.reset();
        })
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
            clearProjectPage();
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