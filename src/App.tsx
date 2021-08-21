import React from 'react';
import './App.css';

function App() {

  const [todos, setTodos] = React.useState<any[]>([]);
  const [inputText, setInputText] = React.useState("");

  const onAddTodo = () => {
    if (!inputText) {
      return alert("Nothing to add...");
    }
    setTodos([...todos, {
      createdAt: new Date().toISOString(),
      message: inputText
    }])
    setInputText("");
  }

  const onRemoveTodo = (createdAt: any) => {
    setTodos(todos.filter((todo: any) => todo.createdAt !== createdAt));
  }

  return (
    <div className="App">
      <h1>To-Do</h1>
      <input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="I need to..." />
      <button onClick={onAddTodo}>Add!</button>
      <div className="todos-content">
        {
          todos.map((todo) => (
            <div key={todo.createdAt} className="todo-list-item">
              <p>{todo.message}</p>
              <p onClick={() => onRemoveTodo(todo.createdAt)} className="close-icon">X</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
