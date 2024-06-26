import pm from "./projectManager";
import storagehandler from "./storage";
import Project from "./project";
import ToDo from "./todo";
import { add, format, formatDistanceToNowStrict } from "date-fns";

function Dom() {

    let currentPage = 0;

    const allbtn = document.querySelector('#allbtn');
    const todaybtn = document.querySelector("#today");
    const weekbtn = document.querySelector("#thisweek");
    const monthbtn = document.querySelector("#thismonth")
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

        projectFilterSetup();
        projectAddDialogSetup();

        if (storagehandler.isEmpty()) {
            loadExample()
        } else {
            pm.setProjectList(storagehandler.load());
            refreshProjectList();
        }
        allbtn.click();
    }

    function loadExample() {
        let exampleproject = Project("Example Project");
        pm.addProject(exampleproject);
        refreshProjectList();
        let exampletaskA = ToDo('Task A', add(new Date(), { hours: -30 }), 'low', "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
        let exampletaskB = ToDo('Task B', add(new Date(), { hours: 1 }), 'low', "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
        let exampletaskC = ToDo('Task C', add(new Date(), { days: 5 }), 'normal', "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");
        let exampletaskD = ToDo('Task D', add(new Date(), { days: 24 }), 'high', "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.");
        exampleproject.addToDo(exampletaskA);
        exampleproject.addToDo(exampletaskB);
        exampleproject.addToDo(exampletaskC);
        exampleproject.addToDo(exampletaskD);
        refreshMain();
    }

    function projectAddDialogSetup() {
        projectform.addEventListener('submit', (e) => {
            const name = projectnameinput.value;
            const newproject = Project(name);
            pm.addProject(newproject);
            refreshProjectList();
            e.preventDefault();
            projectdialog.close();
            projectnameinput.value = "";

            changeProject(newproject.getId());
            refreshMain();
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

    function projectFilterSetup() {
        const buttons = [allbtn, todaybtn, weekbtn, monthbtn];
        const str = ['all', 'today', 'week', 'month']
        buttons.forEach(
            function (button, index) {
                const keyword = str[index]
                button.addEventListener('click', () => {
                    currentPage = keyword;
                    sidebarBgColor(button);
                    refreshMain();

                })
            }
        )
    }

    function changeProject(index) {
        currentPage = index;
        refreshProjectList();
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
                    changeProject(index);
                    refreshMain();
                })

                const renamebutton = createBtn("");
                renamebutton.classList.add("edit");
                renamebutton.addEventListener('click', () => {
                    createProjectRenameForm(project);
                    renamedialog.showModal();
                })

                const deletebutton = createBtn("");
                deletebutton.classList.add("delete");
                deletebutton.addEventListener('click', function () {
                    createDeleteForm(project);
                    deletedialog.showModal();
                })

                div.appendChild(projectbutton);
                div.appendChild(renamebutton);
                div.appendChild(deletebutton);
                projectcontainer.appendChild(div);

            }
        )
        const projectdivs = projectcontainer.querySelectorAll('div');
        projectdivs.forEach(
            function (node, index) {
                if (currentPage === index) {
                    const buttontocolor = node.querySelector('button');
                    sidebarBgColor(buttontocolor);
                }
            }
        )

        //save spot
        storagehandler.save(pm.getProjectList());
    }

    function clearMain() {
        while (maincontent.firstChild) {
            maincontent.firstChild.remove();
        }
    }

    function refreshMain() {
        clearMain();

        let page;

        if (currentPage === "all") {
            page = createFilterPage("All")
        } else if (currentPage === "today") {
            page = createFilterPage("Today")
        } else if (currentPage === "week") {
            page = createFilterPage("In 7 Days")
        } else if (currentPage === "month") {
            page = createFilterPage("In 30 Days")
        } else {
            const project = pm.getProjectList()[currentPage];
            page = createProjectPage(project);
        }

        maincontent.appendChild(page);

        //save spot
        storagehandler.save(pm.getProjectList());
    }

    function createFilterPage(text) {
        const page = document.createElement('div');
        const header = document.createElement('h2');

        header.textContent = text;
        const todocontainer = document.createElement('div');
        todocontainer.classList.add("todocontainer");

        pm.getProjectList().forEach(
            function (project) {
                project.getToDoList().forEach(
                    function (todo) {
                        if (isToDoIncluded(todo)) {
                            const div = createToDoMain(project, todo);
                            todocontainer.appendChild(div);
                        }
                    }
                )
            }
        )
        page.appendChild(header);
        page.appendChild(todocontainer);

        return page;
    }

    function isToDoIncluded(todo) {
        if (currentPage === "today" && todo.isToDoToday()) {
            return true;
        } else if (currentPage === "week" && todo.isInAWeek()) {
            return true;
        } else if (currentPage === "month" && todo.isInAMonth()) {
            return true;
        } else if (currentPage === "all") {
            return true;
        }
        return false;
    }

    function createProjectPage(project) {

        const page = document.createElement('div');
        const projectName = document.createElement('h2');
        const todocontainer = document.createElement('div');
        todocontainer.classList.add("todocontainer");
        const todolist = project.getToDoList();

        projectName.textContent = project.getName();

        todolist.forEach(function (todo, index) {
            todo.setId(index);
            const div = createToDoMain(project, todo);
            todocontainer.appendChild(div);
        });

        const addtodobtn = createBtn("Add New");
        addtodobtn.classList.add("addnewbtn");
        addtodobtn.addEventListener('click', () => {
            createToDoForm(project);
            tododialog.showModal();
        })

        page.appendChild(projectName);
        page.appendChild(todocontainer);
        page.appendChild(addtodobtn);
        return page;
    }

    function createToDoForm(project, toedit = false) {

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
            dueDate.value = format(toedit.getDate(), 'yyyy-MM-dd');
            priority.value = toedit.getPriority();
            description.value = toedit.getDescription();

            newform.addEventListener('submit', (e) => {
                const todo = ToDo(title.value, new Date(dueDate.value), priority.value, description.value);
                toedit.edit(todo);
                e.preventDefault();
                tododialog.close();
                newform.reset();
                refreshMain();
            })

        } else {
            newform.addEventListener('submit', (e) => {
                const todo = ToDo(title.value, new Date(dueDate.value), priority.value, description.value);
                project.addToDo(todo);
                e.preventDefault();
                tododialog.close();
                newform.reset();
                refreshMain();
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

    function createDeleteForm(project, todo = false) {
        const previousform = deletedialog.querySelector('form');
        previousform.remove();
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

                let openedproject;
                if (Number.isInteger(currentPage)) {
                    openedproject = pm.getProjectList()[currentPage];
                } else { openedproject = false; }

                pm.removeProject(project.getId());
                refreshProjectList();
                e.preventDefault();
                deletedialog.close();
                if (currentPage === project.getId()) {
                    clearMain();
                    sidebarClear();
                } else {
                    if (openedproject) {
                        changeProject(openedproject.getId());
                    }
                    refreshMain();
                }
            })
        } else {
            newform.addEventListener('submit', (e) => {
                project.removeToDo(todo);
                e.preventDefault();
                deletedialog.close();
                refreshMain();
            })
        }

        no.addEventListener('click', (e) => {
            e.preventDefault();
            deletedialog.close();
        })
    }

    function createProjectRenameForm(project) {
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

    function createToDoMain(project, todo) {

        const container = document.createElement('div');
        const title = document.createElement('div');
        const dueDate = document.createElement('div');

        container.classList.add('todos');
        title.textContent = todo.getTitle();
        title.classList.add("todotitle");

        setUpDate(container, dueDate, todo);

        dueDate.classList.add("tododate");

        setToDoColor(container, todo);
        const viewbutton = createToDoViewButton(container, todo);
        const checkbox = createToDoCheckBox(container, todo);
        const editbutton = createToDoEditButton(project, todo);
        const deletebutton = createToDoDeleteButton(project, todo);

        container.appendChild(checkbox);
        container.appendChild(title);
        container.appendChild(dueDate);
        container.appendChild(viewbutton);
        container.appendChild(editbutton);
        container.appendChild(deletebutton);

        return container;
    }

    function setUpDate(container, div, todo) {
        let left;

        if (todo.isOverdue()) {
            left = "Overdue";
            container.classList.add("overdue");
        } else if (todo.isToDoToday()) {
            left = "Today";
        } else {
            const days = formatDistanceToNowStrict(todo.getDate(), {
                unit: 'day',
                roundingMethod: 'ceil'
            });
            left = days + " left";
        }

        div.textContent = left;
    }

    function createToDoCheckBox(div, todo) {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('name', 'checkbox');
        if (todo.getCheck()) {
            checkbox.checked = true;
        }
        checkbox.addEventListener('click', () => {
            todo.toggleCheck(checkbox);
            setToDoColor(div, todo);
            storagehandler.save(pm.getProjectList());
        })
        return checkbox;
    }

    function createToDoViewButton(div, todo) {
        const button = createBtn("VIEW");
        const date = document.createElement('div');
        date.textContent = format(todo.getDate(), "yyyy/MM/dd")
        const text = document.createElement('div');
        text.textContent = todo.getDescription();
        const description = document.createElement('div');
        description.appendChild(date);
        description.appendChild(document.createElement('hr'));
        description.appendChild(text);
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

    function createToDoEditButton(project, todo) {
        const button = createBtn("EDIT");
        button.addEventListener('click', (e) => {
            createToDoForm(project, todo);
            tododialog.showModal();
        })

        return button;
    }

    function createToDoDeleteButton(project, todo) {
        const button = createBtn("DELETE");
        button.addEventListener('click', (e) => {
            createDeleteForm(project, todo);
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

    function sidebarClear() {
        const fbuttons = [allbtn, todaybtn, weekbtn, monthbtn];
        fbuttons.forEach(
            function (node) {
                node.classList.remove("blue")
            }
        )

        const pbuttons = projectcontainer.querySelectorAll('button');
        pbuttons.forEach(
            function (node) {
                node.classList.remove("blue")
            }
        )
    }

    function sidebarBgColor(btn) {
        sidebarClear();
        btn.classList.add('blue');
    }

    return {
        initialSetup
    }
}

const dom = Dom();

export default dom;