import { createFetchTodoListAction, clearError } from "./flux/index";
import store from "./store";
import TodoList from "./components/todo-list";
import TodoForm from "./components/todo-form";

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
