import { useEffect, useState } from 'react'
import AddTodoForm from './components/AddTodoForm';
import axios from 'axios';


function App() {
  const [todos, setTodos] = useState([]);
  const backendURL = 'https://qw71ub8s03.execute-api.us-east-1.amazonaws.com';

  // Récupérer toutes les tâches au démarrage
  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get(`${backendURL}/getAllTodoTask`);
      setTodos(response.data);
    };

    fetchTodos();
  }, []); // Appel initial uniquement

  const addTodo = async (title) => {
    const response = await axios.post(`${backendURL}/addTodoTask`, { title });
    setTodos((prev) => [...prev, response.data]);
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${backendURL}/deleteTodoTask`, { data: { todoId: id } });
    setTodos((prev) => prev.filter((todo) => todo.todoId !== id));
  };

  const completeTodo = async (id) => {
    const response = await axios.put(`${backendURL}/updateTodoTask`, { todoId: id, isComplete: true });
    console.log(response);
    setTodos((prev) =>{
      return prev.map((todo) => (todo.todoId === id ? { ...todo, IsComplete: response.data.isComplete } : todo))
    });
  };

  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 min-w-[50%] mx-auto p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">ToDo App</h1>
      <AddTodoForm onAdd={addTodo} />

      <ul className="mt-4">
        {todos.map((todo) => (
          <li
            key={todo.todoId}
            className="flex justify-between items-center p-2 border-b"
          >
            <span
              className={todo.IsComplete ? 'line-through text-gray-400' : ''}
            >
              {todo.Title}
            </span>
            <div>
              {!todo.IsComplete && (
                <button
                  onClick={() => completeTodo(todo.todoId)}
                  className="text-green-500 mx-2"
                >
                  Complete
                </button>
              )}
              <button
                onClick={() => deleteTodo(todo.todoId)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
