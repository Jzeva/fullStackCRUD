import axios from "axios";
import React, { useEffect, useState } from "react";

const API = "http://localhost:8080/users";
type User = {
  id: number;
  name: string;
  age: string;
};

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const startEdit = (user: User) => {
    setEditingId(user.id); // 标记哪一行在编辑
    setEditName(user.name); // 将原值加载到表单中
    setEditAge(user.age); // 同上
  };

  const fetchUsers = async (sort = "") => {
    const response = await axios.get(API, {
      params: sort ? { sort } : {},
    });
    const users = response.data;
    setUsers(users);
  };

  const handleAdd = async () => {
    await axios.post(API, {
      name: name,
      age: age,
    });
    setAge("");
    setName("");
    fetchUsers();
  };

  const handleSave = async (id: number) => {
    await axios.patch(`${API}/${id}`, {
      name: editName,
      age: editAge,
    });
    setEditingId(null);
    fetchUsers();
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers(sortOrder);
  }, [sortOrder]);

  const toggleSort = () => {
    const finalSort = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(finalSort);
    fetchUsers(finalSort);
  };

  return (
    <div>
      <button onClick={toggleSort}>Sort by age {sortOrder}</button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {editingId === user.id ? (
              <>
                <input
                  placeholder="Edit Name"
                  name="Edit Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  placeholder="Edit Age"
                  name="Edit Age"
                  value={editAge ?? ""}
                  onChange={(e) => setEditAge(e.target.value)}
                />
                <button onClick={() => handleSave(user.id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {user.name}-{user.age}
                <button onClick={() => startEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <input
        placeholder="name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="age"
        name="age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default App;
