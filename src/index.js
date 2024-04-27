import "./styles.css";
import Project from "./project";

let project = Project('project');
let todo = project.getToDo()[0];
console.log(todo.getTitle());
console.log(todo.getCheck());
todo.toggleCheck();
console.log(todo.getCheck());