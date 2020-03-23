import express from "express";

type TodoType = {
  id: number;
  name: string;
  done: boolean;
};

const router = express.Router();
const todoList: TodoType[] = [];

class Todo {
  id: number;
  name: string;
  done: boolean;

  constructor(id: number, name: string, done: boolean) {
    this.id = id;
    this.name = name;
    this.done = done;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      done: this.done
    };
  }
}

router.post("/", (req, res, next) => {
  const id = todoList.length ? todoList[todoList.length - 1].id + 1 : 0;
  const name: string = req.body.name;
  const item = new Todo(id, name, false);
  todoList.push(item);
  return res.status(201).send(item);
});

router.get("/", (req, res, next) => {
  return res.send({ todoList: todoList });
});

router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  const todo = todoList.find(todo => todo.id == +id);
  if (!todo) {
    return res.status(400).end();
  }
  const { name, done }: { name: string, done: boolean } = req.body;
  todo.name = name;
  todo.done = done;
  return res.status(200).send(todo);
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  const index = todoList.findIndex(todo => todo.id == +id);
  todoList.splice(index, 1);
  return res.status(204).send("done");
});

export default router;
