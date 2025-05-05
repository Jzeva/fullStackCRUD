// src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 8080;
app.use(cors());
app.use(express.json());

type User = {
  id: number;
  name: string;
  age: number;
};

let users: User[] = [
  { id: 1, name: "Alice", age: 28 },
  { id: 2, name: "Bob", age: 35 },
  { id: 3, name: "Charlie", age: 22 },
  { id: 4, name: "David", age: 30 },
  { id: 5, name: "Eva", age: 26 },
  { id: 6, name: "Frank", age: 40 },
  { id: 7, name: "Grace", age: 24 },
  { id: 8, name: "Henry", age: 32 },
  { id: 9, name: "Ivy", age: 29 },
  { id: 10, name: "Jack", age: 38 },
  { id: 11, name: "Karen", age: 27 },
  { id: 12, name: "Leo", age: 31 },
  { id: 13, name: "Mona", age: 23 },
  { id: 14, name: "Nate", age: 33 },
  { id: 15, name: "Olivia", age: 25 },
  { id: 16, name: "Paul", age: 36 },
  { id: 17, name: "Quinn", age: 33 },
  { id: 18, name: "Rachel", age: 21 },
  { id: 19, name: "Sam", age: 37 },
  { id: 20, name: "Tina", age: 20 },
];

app.get("/users", (req: Request, res: Response) => {
  const sort = req.query.sort;
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 5;

  let result = [...users];
  if (sort === "asc") {
    result.sort((a, b) => a.age - b.age);
  }
  if (sort === "desc") {
    result.sort((a, b) => b.age - a.age);
  }

  const startIndex = (page - 1) * pageSize;
  const paged = result.slice(startIndex, startIndex + pageSize);
  return res.json({ users: paged, total: result.length, page, pageSize });
});

app.post("/users", (req: Request, res: Response) => {
  const { name, age } = req.body;
  const newUser = {
    id: users.length + 1,
    name: name,
    age: age,
  };

  users.push(newUser);
  res.json(users);
});

app.patch("/users/:id", (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { name, age } = req.body;
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: "there's no such an user" });
  user.name = name;
  user.age = age;

  res.json(user);
});

app.delete("/users/:id", (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return res.status(404).json({ error: "User not found" });

  const deletedUser = users.splice(index, 1);
  res.json(deletedUser[0]);
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
