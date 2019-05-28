import React, { Component } from "react";
import axios from "axios";
import "./styles/App.scss";
import loadingGif from "./img/loader.gif";
import ListItem from "./components/listItem";

class App extends Component {
  constructor() {
    super();
    this.state = {
      newTask: "",
      editing: false,
      editingIndex: null,
      notification: null,
      tasks: [],
      loading: true
    };

    this.apiUrl = "https://5ced566eb779120014b4a10e.mockapi.io";

    this.handleChange = this.handleChange.bind(this);
    this.addTask = this.addTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.editTask = this.editTask.bind(this);
    this.alert = this.alert.bind(this);
  }

  async componentDidMount() {
    const response = await axios.get(`${this.apiUrl}/tasks`);

    this.setState({
      tasks: response.data,
      loading: false
    });
  }

  handleChange(event) {
    this.setState({
      newTask: event.target.value
    });
  }

  async addTask() {
    const response = await axios.post(`${this.apiUrl}/tasks`, {
      name: this.state.newTask
    });

    const updatedTasks = this.state.tasks;
    updatedTasks.push(response.data);

    this.setState({
      tasks: updatedTasks,
      newTask: ""
    });

    this.alert("Task added successfully.");
  }

  async deleteTask(index) {
    const updatedTasks = this.state.tasks;
    const currentTask = updatedTasks[index];

    axios.delete(`${this.apiUrl}/tasks/${currentTask.id}`); // This deletes from the API.

    delete updatedTasks[index];

    this.setState({
      tasks: updatedTasks
    });

    this.alert("Task deleted successfully.");
  }

  editTask(index) {
    const editableTask = this.state.tasks[index];
    this.setState({
      editing: true,
      newTask: editableTask.name,
      editingIndex: index
    });
  }

  async updateTask() {
    const currentTask = this.state.tasks[this.state.editingIndex];
    const response = await axios.put(`${this.apiUrl}/tasks/${currentTask.id}`, {
      name: this.state.newTask
    });

    const updatedTasks = this.state.tasks;
    updatedTasks[this.state.editingIndex] = response.data;

    this.setState({
      tasks: updatedTasks,
      editing: false,
      editingIndex: null,
      newTask: ""
    });

    this.alert("Task updated successfully.");
  }

  alert(notification) {
    this.setState({ notification });

    setTimeout(() => {
      this.setState({ notification: null });
    }, 2000);
  }

  render() {
    return (
      <React.Fragment>
        <h2 className="text-center p4">Tasks App</h2>
        <div className="container">
          {this.state.notification && (
            <div className="alert alert-success mt-3">
              <p className="text-center">{this.state.notification}</p>
            </div>
          )}
          <input
            name="task-input"
            className="form-control my-4"
            placeholder="Add a new task"
            onChange={this.handleChange}
            value={this.state.newTask}
          />
          <button
            className="btn-success form-control mb-3"
            onClick={this.state.editing ? this.updateTask : this.addTask}
            disabled={this.state.newTask.length < 5}
          >
            {this.state.editing ? "Update task" : "Add task"}
          </button>
          {this.state.loading && (
            <div className="loader">
              <img className="loader-img" src={loadingGif} alt="Loader" />
            </div>
          )}
          {(!this.state.editing || this.state.loading) && (
            <ul className="list-group">
              {this.state.tasks.map((item, index) => {
                return (
                  <ListItem
                    key={item.id}
                    item={item}
                    editTask={() => {
                      this.editTask(index);
                    }}
                    deleteTask={() => {
                      this.deleteTask(index);
                    }}
                  />
                );
              })}
            </ul>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default App;
