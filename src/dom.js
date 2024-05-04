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
    const renamedialog = document.querySelector('#renamedialog');
    const deletedialog = document.querySelector('#deletedialog');
    const maincontent = document.querySelector('#maincontent');
    const tododialog = document.querySelector('#tododialog');

    function initialSetup() {
        projectDialogSetup();

        //Starting Example
        let exampleproject = Project("Example Project");
        pm.addProject(exampleproject);
        refreshProjectList();
        let exampletaskA = ToDo('Task A', '2020-05-15', 'low', "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
        let exampletaskB = ToDo('Task B', '2020-06-25', 'normal', "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");
        let exampletaskC = ToDo('Task C', '2020-12-01', 'high', "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.");
        exampleproject.addToDo(exampletaskA);
        exampleproject.addToDo(exampletaskB);
        exampleproject.addToDo(exampletaskC);
        loadProjectPage(0);
    }

    function projectDialogSetup() {
        projectform.addEventListener('submit', (e) => {
            const name = projectnameinput.value;
            const newproject = Project(name);
            pm.addProject(newproject);
            refreshProjectList();
            e.preventDefault();
            projectdialog.close();
            projectnameinput.value = "";
        })

        projectcancel.addEventListener('click', (e) => {
            e.preventDefault();
            projectdialog.close();
            projectnameinput.value = "";
        })

        addprojectbtn.addEventListener('click', () => {
            projectdialog.showModal();
        })
    }

    function refreshProjectList() {

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

                const renamebutton = createBtn("");
                renamebutton.classList.add("edit");
                renamebutton.addEventListener('click', () => {
                    createProjectRenameForm(index);
                    renamedialog.showModal();
                })

                const deletebutton = createBtn("");
                deletebutton.classList.add("delete");
                deletebutton.addEventListener('click', function () {
                    createDeleteForm(index);
                    deletedialog.showModal();
                })

                div.appendChild(projectbutton);
                div.appendChild(renamebutton);
                div.appendChild(deletebutton);
                projectcontainer.appendChild(div);

            }
        )
    }

    function clearProjectPage() {
        while (maincontent.firstChild) {
            maincontent.firstChild.remove();
        }
    }

    function loadProjectPage(index) {
        clearProjectPage();

        const maindiv = document.createElement('div');
        const projectName = document.createElement('h2');
        const todocontainer = document.createElement('div');
        todocontainer.classList.add("todocontainer");
        const project = pm.getProjectList()[index];
        const todolist = project.getToDoList();

        projectName.textContent = project.getName();

        todolist.forEach(function (todo, id) {
            const div = createToDoMain(todo, id, project);
            todocontainer.appendChild(div);
        });

        const addtodobtn = createBtn("Add New");
        addtodobtn.classList.add("addnewbtn");
        addtodobtn.addEventListener('click', () => {
            createToDoForm(index);
            tododialog.showModal();
        })

        maindiv.appendChild(projectName);
        maindiv.appendChild(todocontainer);
        maindiv.appendChild(addtodobtn);
        maincontent.appendChild(maindiv);
    }

    function createToDoForm(index, toedit=false) {

        const todoinputs = tododialog.querySelector('#todoinputs');
        const title = todoinputs.querySelector('#title');
        const dueDate = todoinputs.querySelector('#duedate');
        const priority = todoinputs.querySelector('#priority');
        const description = todoinputs.querySelector('#description');

        const previousform = tododialog.querySelector('form');
        previousform.remove();

        const newform = document.createElement('form');
        const newbuttons = document.createElement('div');
        newbuttons.classList.add('submitbtn');
        const addbtn = createBtn("ADD");
        const cancel = createBtn("CANCEL");
        newbuttons.appendChild(addbtn);
        newbuttons.appendChild(cancel);

        newform.appendChild(todoinputs);
        newform.appendChild(newbuttons);
        tododialog.appendChild(newform);

        if (toedit !== false) {
            addbtn.textContent = "CHANGE";
            title.value = toedit.getTitle();
            dueDate.value = toedit.getDate();
            priority.value = toedit.getPriority();
            description.value = toedit.getDescription(); 

            newform.addEventListener('submit', (e) => {
                const todo = ToDo(title.value, dueDate.value, priority.value, description.value);
                toedit.edit(todo);
                e.preventDefault();
                tododialog.close();
                newform.reset();
                loadProjectPage(index);
            })

        } else {
            newform.addEventListener('submit', (e) => {
                const todo = ToDo(title.value, dueDate.value, priority.value, description.value);
                const project = pm.getProjectList()[index];
                project.addToDo(todo);
                e.preventDefault();
                tododialog.close();
                newform.reset();
                loadProjectPage(index);
            })
        }

        cancel.addEventListener('click', (e) => {
            e.preventDefault();
            tododialog.close();
            newform.reset();
        })

        setToDoDialogColor(tododialog, priority.value);
        priority.addEventListener('change', () => {
            setToDoDialogColor(tododialog, priority.value);
        })
    }


    function createDeleteForm(index, todo=false) {
        const previousform = deletedialog.querySelector('form');
        previousform.remove();

        const project = pm.getProjectList()[index];
        let text;

        if (todo === false) {
            text = `Delete project "${project.getName()}"?`;
        } else {
            text = `Delete task "${todo.getTitle()}"?`;
        }

        const newform = document.createElement('form');
        const p = document.createElement('div');
        p.textContent = text;
        const innerdiv = document.createElement('div');
        innerdiv.classList.add("submitbtn");
        const yes = createBtn("YES");
        const no = createBtn("NO");

        innerdiv.appendChild(yes);
        innerdiv.appendChild(no);
        newform.appendChild(p);
        newform.appendChild(innerdiv);
        deletedialog.appendChild(newform);

        if (todo === false) {
            newform.addEventListener('submit', (e) => {
                pm.removeProject(index);
                e.preventDefault();
                deletedialog.close();
                refreshProjectList();
                clearProjectPage();
            })
        } else {
            newform.addEventListener('submit', (e) => {
                project.removeToDo(todo);
                e.preventDefault();
                deletedialog.close();
                loadProjectPage(project.getId());
            })
        }

        no.addEventListener('click', (e) => {
            e.preventDefault();
            deletedialog.close();
        })
    }

    function createProjectRenameForm(index) {
        const previousform = renamedialog.querySelector('form');
        previousform.remove();

        const newform = document.createElement('form');
        const label = document.createElement('label');
        label.textContent = "Enter new name";
        label.setAttribute("for", "renameinput");
        const input = document.createElement('input');
        input.setAttribute("id", "renameinput");
        input.setAttribute("name", "renameinput");
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        div2.classList.add("submitbtn");
        const confirm = createBtn("RENAME");
        const cancel = createBtn("CANCEL");

        div1.appendChild(label);
        div1.appendChild(input);
        div2.appendChild(confirm);
        div2.appendChild(cancel);
        newform.appendChild(div1);
        newform.appendChild(div2);
        renamedialog.appendChild(newform);

        const project = pm.getProjectList()[index];

        input.setAttribute('type', 'text');
        input.setAttribute('required', "");
        input.value = project.getName();
        newform.addEventListener('submit', (e) => {
            project.setName(input.value);
            refreshProjectList();
            e.preventDefault();
            renamedialog.close();
        })
        cancel.addEventListener('click', (e) => {
            e.preventDefault();
            renamedialog.close();
        })
    }

    function createBtn(text) {
        const btn = document.createElement('button');
        btn.textContent = text;
        return btn;
    }

    function createToDoMain(todo, index, project) {
        todo.setId(index);

        const container = document.createElement('div');
        const title = document.createElement('div');
        const dueDate = document.createElement('div');

        container.classList.add('todos');
        title.textContent = todo.getTitle();
        title.classList.add("todotitle");
        dueDate.textContent = todo.getDate();
        dueDate.classList.add("tododate");

        setToDoColor(container, todo);
        const viewbutton = createToDoViewButton(container, todo);
        const checkbox = createToDoCheckBox(container, todo, index);
        const editbutton = createToDoEditButton(todo, project);
        const deletebutton = createToDoDeleteButton(todo, project);

        container.appendChild(checkbox);
        container.appendChild(title);
        container.appendChild(dueDate);
        container.appendChild(viewbutton);
        container.appendChild(editbutton);
        container.appendChild(deletebutton);

        return container;
    }

    function createToDoCheckBox(div, todo, index) {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', 'check' + index);
        if (todo.getCheck()) {
            checkbox.checked = true;
        }
        checkbox.addEventListener('click', () => {
            todo.toggleCheck(checkbox);
            setToDoColor(div, todo);
        })
        return checkbox;
    }

    function createToDoViewButton(div, todo) {
        const button = createBtn("VIEW");
        const description = document.createElement('div');
        description.textContent = todo.getDescription();
        description.classList.add('description');
        button.addEventListener('click', () => {
            if (div.lastChild.classList.contains('description')) {
                div.lastChild.remove();
            } else {
                div.appendChild(description);
            }
        })
        return button;
    }

    function createToDoEditButton(todo, project) {
        const button = createBtn("EDIT");
        button.addEventListener('click', (e) => {
            createToDoForm(project.getId(), todo);
            tododialog.showModal();
        })

        return button;
    }

    function createToDoDeleteButton(todo, project) {
        const button = createBtn("DELETE");
        button.addEventListener('click', (e) => {
            createDeleteForm(project.getId(), todo);
            deletedialog.showModal();
        })

        return button;
    }

    function setToDoColor(div, todo) {
        div.classList.remove('plow');
        div.classList.remove('pnormal');
        div.classList.remove('phigh');

        const priority = todo.getPriority();
        const check = todo.getCheck();

        if (!check) {
            if (priority === 'high') {
                div.classList.add('phigh');
            } else if (priority === 'normal') {
                div.classList.add('pnormal');
            } else if (priority === 'low') {
                div.classList.add('plow');
            }
        }
    }

    function setToDoDialogColor(div, priority) {
        div.classList.remove('plow');
        div.classList.remove('pnormal');
        div.classList.remove('phigh');

        if (priority === 'high') {
            div.classList.add('phigh');
        } else if (priority === 'normal') {
            div.classList.add('pnormal');
        } else if (priority === 'low') {
            div.classList.add('plow');
        }
    }

    return {
        initialSetup
    }
}

const dom = Dom();

export default dom;