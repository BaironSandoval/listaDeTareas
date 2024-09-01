import axios from "axios";
import React, { useEffect, useState } from "react";
import "./style.css";

function Todo() {
  const [todoList, setTodoList] = useState([]);
  const [editableId, setEditableId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
  const [newTask, setNewTask] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [editedDeadline, setEditedDeadline] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:3001/getTodoList")
      .then((result) => {
        setTodoList(result.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const toggleEditable = (id) => {
    const rowData = todoList.find((data) => data._id === id);
    if (rowData) {
      setEditableId(id);
      setEditedTask(rowData.task);
      setEditedStatus(rowData.status);
      setEditedDeadline(rowData.deadline || "");
    } else {
      setEditableId(null);
      setEditedTask("");
      setEditedStatus("");
      setEditedDeadline("");
    }
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask || !newStatus || !newDeadline) {
      alert("All fields must be filled out.");
      return;
    }

    axios
      .post("http://127.0.0.1:3001/addTodoList", {
        task: newTask,
        status: newStatus,
        deadline: newDeadline,
      })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const saveEditedTask = (id) => {
    const editedData = {
      task: editedTask,
      status: editedStatus,
      deadline: editedDeadline,
    };

    if (!editedTask || !editedStatus || !editedDeadline) {
      alert("All fields must be filled out.");
      return;
    }

    axios
      .put("http://127.0.0.1:3001/updateTodoList/" + id, editedData)
      .then((result) => {
        console.log(result);
        setEditableId(null);
        setEditedTask("");
        setEditedStatus("");
        setEditedDeadline("");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const deleteTask = (id) => {
    axios
      .delete("http://127.0.0.1:3001/deleteTodoList/" + id)
      .then((result) => {
        console.log(result);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container-fluid">
      <div className="bg-light shadow rounded">
        <h1 className="text-center text-info mt-3">
          <i className="fa-solid fa-list-check"></i> My Todo-s
        </h1>

        <div className="row justify-content-center">
          <form className="vh- bg-light p-0 col-12 col-md-8 col-lg-6">
            <div className="mb-3">
              <input
                className="form-control"
                type="text"
                placeholder="Add new..."
                onChange={(e) => setNewTask(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                type="text"
                placeholder="Status"
                onChange={(e) => setNewStatus(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control text-body-secondary"
                type="datetime-local"
                onChange={(e) => setNewDeadline(e.target.value)}
              />
            </div>
            <div className="text-center">
              <button
                onClick={addTask}
                className="btn text-light btn-sm px-4 bg-info shadow-sm"
              >
                ADD
              </button>
            </div>
          </form>
        </div>

        <hr className="my-4 text-body-secondary"></hr>

        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-info text-center">Task</th>
                  <th className="text-info text-center">Status</th>
                  <th className="text-info text-center">Deadline</th>
                  <th className="text-info text-center">Actions</th>
                </tr>
              </thead>
              {Array.isArray(todoList) ? (
                <tbody>
                  {todoList.map((data) => (
                    <tr key={data._id}>
                      <td className="text-body-secondary text-center">
                        {editableId === data._id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editedTask}
                            onChange={(e) => setEditedTask(e.target.value)}
                          />
                        ) : (
                          data.task
                        )}
                      </td>
                      <td className="text-body-secondary text-center">
                        {editableId === data._id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editedStatus}
                            onChange={(e) => setEditedStatus(e.target.value)}
                          />
                        ) : (
                          data.status
                        )}
                      </td>
                      <td className="text-body-secondary text-center">
                        {editableId === data._id ? (
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={editedDeadline}
                            onChange={(e) =>
                              setEditedDeadline(e.target.value)
                            }
                          />
                        ) : data.deadline ? (
                          new Date(data.deadline).toLocaleString()
                        ) : (
                          ""
                        )}
                      </td>
                      <td className="text-body-secondary text-center">
                        {editableId === data._id ? (
                          <button
                            className="btn btn-sm"
                            onClick={() => saveEditedTask(data._id)}
                          >
                            <i className="fa-solid fa-floppy-disk text-body-secondary"></i>
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm"
                            onClick={() => toggleEditable(data._id)}
                          >
                            <i className="fa-solid fa-pencil text-body-secondary"></i>
                          </button>
                        )}
                        <button
                          className="btn btn-sm ml-1"
                          onClick={() => deleteTask(data._id)}
                        >
                          <i className="fa-regular fa-trash-can text-danger"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="4">Loading tasks...</td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Todo;
