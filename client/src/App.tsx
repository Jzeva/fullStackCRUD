import axios from "axios";
import React, { useEffect, useState } from "react";

const API = "http://localhost:8080/users";
type User = {
  id: string;
  name: string;
  age: string;
};

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 5;

  const startEdit = (user: User) => {
    setEditingId(user.id); // 标记哪一行在编辑
    setEditName(user.name); // 将原值加载到表单中
    setEditAge(user.age); // 同上
  };

  const fetchUsers = async (
    sort: "asc" | "desc" | null,
    currentPage: number
  ) => {
    const response = await axios.get(API, {
      params: {
        sort,
        page: page,
        pageSize,
      },
    });
    const users = response.data.users;
    const total = response.data.total;
    setUsers(users);
    setTotal(total);
    setPage(currentPage);
  };

  const handleAdd = async () => {
    await axios.post(API, {
      name: name,
      age: age,
    });
    setAge("");
    setName("");
    fetchUsers(sortOrder, page);
  };

  const handleSave = async (id: string) => {
    await axios.patch(`${API}/${id}`, {
      name: editName,
      age: editAge,
    });
    setEditingId(null);
    fetchUsers(sortOrder, page);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`${API}/${id}`);
    fetchUsers(sortOrder, 1);
  };

  const handlePrev = () => {
    if (page > 1) fetchUsers(sortOrder, page - 1);
  };

  const handleNext = () => {
    if (page * pageSize < total) fetchUsers(sortOrder, page + 1);
  };

  useEffect(() => {
    fetchUsers(sortOrder, page);
  }, [sortOrder]);

  const toggleSort = () => {
    const finalSort = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(finalSort);
    fetchUsers(finalSort, 1);
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
      <div>
        <button onClick={handlePrev} disabled={page === 1}>
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} of {Math.ceil(total / pageSize)}
        </span>
        <button onClick={handleNext} disabled={page * pageSize >= total}>
          Next
        </button>
      </div>
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
