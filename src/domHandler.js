const projectContainer = document.querySelector('.projectcontainer');
const maincontent = document.querySelector('#maincontent')

const addProjectButton = (project) => {
    const button = document.createElement('button');
    button.textContent = project.getName();
    // add click event that loads the project page
    button.addEventListener('click', function() {
        loadProjectPage(project);
    })

    projectContainer.appendChild(button);
}

const loadProjectPage = (project) => {
    maincontent.removeChild(maincontent.firstChild);
    const projectdiv = document.createElement('div');

    let todos = project.getToDo();
    todos.forEach(
        function(todo) {
            const todocontainer = document.createElement('div');
            todocontainer.textContent = todo.getTitle();
            projectdiv.appendChild(todocontainer);
        }
    )

    const addToDoButton = document.createElement('button');
    addToDoButton.textContent = "ADD NEW TASK";
    projectdiv.appendChild(addToDoButton);

    maincontent.appendChild(projectdiv);

}

export {
    addProjectButton,
    loadProjectPage
}