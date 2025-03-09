import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos"));
    if (savedTodos) {
      setTodos(savedTodos);
    }
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const addTodo = () => {
    if (inputValue.trim() === "") return;
    setTodos([...todos, { text: inputValue, completed: false }]);
    setInputValue("");
  };

  const toggleComplete = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const editTodo = (index) => {
    setIsEditing(index);
    setEditingText(todos[index].text);
  };

  const saveEdit = (index) => {
    const newTodos = [...todos];
    newTodos[index].text = editingText;
    setTodos(newTodos);
    setIsEditing(null);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <h1>Enhanced To-Do List</h1>
      
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
      <div className="input-area">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a new task"
        />
        <button onClick={addTodo}>Add Task</button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo, index) => (
          <li key={index} className={`todo-item ${todo.completed ? "completed" : ""}`}>
            {isEditing === index ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => saveEdit(index)}>Save</button>
              </>
            ) : (
              <>
                <span>{todo.text}</span>
                <button onClick={() => toggleComplete(index)}>
                  {todo.completed ? "Undo" : "Complete"}
                </button>
                <button onClick={() => editTodo(index)}>Edit</button>
                <button onClick={() => deleteTodo(index)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
