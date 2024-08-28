const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();
const { setAsync, getAsync } = require("../redis");

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });

  const todoCurrentCounter = await getAsync("added_todos");
  const todoCounterInc = todoCurrentCounter
    ? Number(todoCurrentCounter) + 1
    : 1;
  await setAsync("added_todos", todoCounterInc);

  res.send(todo);
});

router.get("/statistics", async (_req, res) => {
  const todoCurrentCounter = await getAsync("added_todos");
  res.json({ added_todos: Number(todoCurrentCounter) || 0 });
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.json(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.body.id,
    { text: req.body.text, done: req.body.done },
    { new: true }
  );
  res.json(updatedTodo);
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
