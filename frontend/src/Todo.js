import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Todo() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodoList();
  }, []);

  const fetchTodoList = async () => {
    try {
      const response = await axios.get("/api/todos");
      setTodoList(response.data);
    } catch (error) {
      alert("Error fetching todo list. Please try again later.");
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo) {
      alert("Please add a task.");
      return;
    }
    try {
      const response = await axios.post("/api/todos", { title: newTodo });
      setTodoList([...todoList, response.data]);
      setNewTodo("");
      setShowForm(false); // Hide the form after adding a task
    } catch (error) {
      alert("Error adding todo. Please try again later.");
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const response = await axios.put(`/api/todos/${id}`, {
        complete: !currentStatus,
      });
      const updatedList = todoList.map((todo) => {
        if (todo.id === id) {
          return { ...todo, complete: !currentStatus };
        }
        return todo;
      });
      setTodoList(updatedList);
    } catch (error) {
      alert("Error updating todo. Please try again later.");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      const updatedList = todoList.filter((todo) => todo.id !== id);
      setTodoList(updatedList);
    } catch (error) {
      alert("Error deleting todo. Please try again later.");
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleHome = () => {
    navigate("/dashboard");
  };

  const handleCreateTask = () => {
    setShowForm(true);
  };

  const handleCreateAnotherTask = () => {
    setShowForm(true);
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <div className="flex justify-end space-x-4 mt-6">
        <button
          className="px-4 py-2 text-lg font-medium text-black bg-white-500 rounded-lg focus:outline-none focus:bg-white-600 hover:underline"
          onClick={handleHome}
        >
          Home
        </button>
        <button
          className="px-4 py-2 text-lg font-medium text-black bg-white-500 rounded-lg focus:outline-none focus:bg-white-600 hover:underline"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {!showForm && todoList.length === 0 && (
        <div className="flex flex-col items-center justify-center p-48">
          <p className="text-lg text-gray-600" style={{ whiteSpace: "nowrap" }}>
            You have no tasks. Create one!
          </p>
          <button
            className="px-4 py-2 mt-4 text-l font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:bg-green-600"
            style={{ whiteSpace: "nowrap" }}
            onClick={handleCreateTask}
          >
            Create Task
          </button>
        </div>
      )}

      {showForm && (
        <div className="flex items-center justify-center mt-40">
          <input
            type="text"
            className="block py-1 px-5 text-base text-center text-black-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button
            className="px-3 py-1 text-l ml-2 font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:bg-green-600"
            onClick={handleAddTodo}
          >
            Add
          </button>
        </div>
      )}

      {todoList.length > 0 && !showForm && (
        <div className="mt-28">
          <table className="w-full text-base text-left rtl:text-right text-black-500 dark:text-black-400">
            <thead className="text-base text-black-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-black-400">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center "></div>
                </th>
                <th scope="col" className="px-4 py-2 text-base font-serif">
                  Task
                </th>
                <th scope="col" className="px-4 py-2 text-base font-serif">
                  Status
                </th>
                <th scope="col" className="px-4 py-2 text-base font-serif">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {todoList.map((todo) => (
                <tr
                  key={todo.id}
                  className="bg-white border-b dark:bg-black-800 dark:border-black-700 hover:bg-black-50 dark:hover:bg-black-600 font-serif"
                >
                  <td className="w-100 px-5 py-2">
                    <div className="flex items-center">
                      <input
                        id={`checkbox-table-search-${todo.id}`}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-black-800 dark:focus:ring-offset-black-800 focus:ring-2 dark:bg-black-700 dark:border-black-600 font-serif"
                        checked={todo.complete}
                        onChange={() =>
                          handleToggleComplete(todo.id, todo.complete)
                        }
                      />
                      <label
                        htmlFor={`checkbox-table-search-${todo.id}`}
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <td className="w-100 px-5 py-2">
                    <span
                      className={
                        todo.complete
                          ? "line-through text-sm text-red-500"
                          : "text-lg font-normal"
                      }
                    >
                      {todo.title}
                    </span>
                  </td>
                  <td className=" w-100 px-4 py-4">
                    <div className="flex items-center text-base font-serif">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${
                          todo.complete ? "bg-green-500" : "bg-red-500"
                        } me-2`}
                      ></div>{" "}
                      {todo.complete ? "Completed" : "Pending"}
                    </div>
                  </td>
                  <td className="w-100 px-4 py-4">
                    <button
                      className="font-medium text-red-600 dark:text-red-500 text-base font-serif"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <button
              className="px-4 py-2 text-l font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:bg-green-600 text-center"
              onClick={handleCreateAnotherTask}
            >
              Create Another Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Todo;
