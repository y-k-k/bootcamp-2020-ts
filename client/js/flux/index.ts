import { TodoType } from "../types";

/**
 * Dispatcher
 */
class Dispatcher<S> extends EventTarget {
  dispatch() {
    this.dispatchEvent(new CustomEvent("event"));
  }

  subscribe(subscriber: () => void) {
    this.addEventListener("event", subscriber);
  }
}

/**
 * Action Creator and Action Types
 */
const FETCH_TODO_ACTION_TYPE = "Fetch todo list from server";

type FetchTodoAction = {
  type: typeof FETCH_TODO_ACTION_TYPE;
  payload: undefined;
};

export const createFetchTodoListAction: () => FetchTodoAction = () =>({
  type: FETCH_TODO_ACTION_TYPE,
  payload: undefined,
});

const ADD_TODO_ACTION_TYPE = "A todo addition to store";

type AddTodoAction = {
  type: typeof ADD_TODO_ACTION_TYPE;
  payload: { name: string };
};

export const createAddTodoAction: (todo: { name: string }) => AddTodoAction = todo => ({
  type: ADD_TODO_ACTION_TYPE,
  payload: todo,
});

const UPDATE_TODO_ACTION_TYPE = "Update todo state";

type UpdateTodoAction = {
  type: typeof UPDATE_TODO_ACTION_TYPE;
  payload: TodoType;
};

export const updateTodoAction: (todo: TodoType) => UpdateTodoAction = todo => ({
  type: UPDATE_TODO_ACTION_TYPE,
  payload: todo
});

const REMOVE_TODO_ACTION_TYPE = "Remove todo";

type RemoveTodoAction = {
  type: typeof REMOVE_TODO_ACTION_TYPE;
  payload: TodoType;
};

export const removeTodoAction: (todo: TodoType) => RemoveTodoAction = todo => ({
  type: REMOVE_TODO_ACTION_TYPE,
  payload: todo
});

const CLEAR_ERROR = "Clear error from state";

type ClearError = {
  type: typeof CLEAR_ERROR;
  payload: null;
};

export const clearError: () => ClearError = () => ({
  type: CLEAR_ERROR,
  payload: null, 
});

type Actions = FetchTodoAction | AddTodoAction | UpdateTodoAction | RemoveTodoAction | UpdateTodoAction | ClearError;

/**
 * Store Creator
 */
type State = {
  todoList: TodoType[];
  error?: any;
};

const api = "http://localhost:3000/todo";

const defaultState: State = {
  todoList: [],
  error: undefined,
};

const headers = {
  "Content-Type": "application/json; charset=utf-8"
};

const reducer = async (prevState: State, action: Actions) => {
  switch (action.type) {
    case FETCH_TODO_ACTION_TYPE: {
      try {
        const resp = await fetch(api).then(d => d.json());
        return { todoList: resp.todoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case UPDATE_TODO_ACTION_TYPE: {
      const { id, ...body } = action.payload;
      try {
        const resp = await fetch(`${api}/${id}`, {
          method: "PATCH",
          mode: "cors",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(body)
        }).then(d => d.json());
        const idx = prevState.todoList.findIndex(todo => todo.id === resp.id);
        if (idx === -1) return prevState;
        const nextTodoList = prevState.todoList.concat();
        nextTodoList[idx] = resp;
        return { todoList: nextTodoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case REMOVE_TODO_ACTION_TYPE: {
      const { id } = action.payload;
      try {
        await fetch(`${api}/${id}`, {
          method: "DELETE",
          mode: "cors"
        });
        const idx = prevState.todoList.findIndex(todo => todo.id == id);
        if (idx === -1) return prevState;
        const nextTodoList = prevState.todoList.concat();
        nextTodoList.splice(idx, 1);
        return { todoList: nextTodoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case ADD_TODO_ACTION_TYPE: {
      const body = JSON.stringify(action.payload);
      const config = { method: "POST", body, headers };
      try {
        const resp = await fetch(api, config).then(d => d.json());
        return { todoList: [...prevState.todoList, resp], error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case CLEAR_ERROR: {
      return { ...prevState, error: null };
    }
    default: {
      throw new Error(`unexpected action type`);
    }
  }
};

export function createStore(initialState = defaultState) {
  const dispatcher = new Dispatcher();
  let state = initialState;

  const dispatch = async (action: Actions ) => {
    console.group(action.type);
    console.log("prev", state);
    state = await reducer(state, action);
    console.log("next", state);
    console.groupEnd();
    dispatcher.dispatch();
  };

  const subscribe = (subscriber: (state: State) => void) => {
    dispatcher.subscribe(() => subscriber(state));
  };

  return {
    dispatch,
    subscribe
  };
}
