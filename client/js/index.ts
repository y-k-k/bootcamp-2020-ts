import { createFetchTodoListAction, clearError } from "./flux/index.js";
import store from "./store.js";
import TodoList from "./components/todo-list.js";
import TodoForm from "./components/todo-form.js";

new TodoForm().mount();
const parent = document.querySelector(".todo-list__wrapper");

if (!parent) throw new Error("no todo list wrapper!");

store.subscribe(state => {
  if (state.error == null) {
    new TodoList(parent, { todoList: state.todoList }).render();
  } else {
    console.error(state.error);
    alert(state.error);
    store.dispatch(clearError());
  }
});

store.dispatch(createFetchTodoListAction());
