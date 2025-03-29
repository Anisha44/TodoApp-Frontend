import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuth } from "./context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const API_URL = `http://localhost:8000/api/auth/todos/`;

function TodoApp() {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState(null);
  const [taskDeadline, setTaskDeadline] = useState(null);
  const [taskComments, setTaskComments] = useState("");
  const [taskStatus, setTaskStatus] = useState("pending");
  const [editingTask, setEditingTask] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [hitApi, setHitApi] = useState(false)

  // Fetch tasks from the API
  useEffect(() => {
    fetchTasks();
  }, [filterStatus, hitApi]);

  useEffect(() => {
    if (openDialog === false){
      setTaskTitle("")
      setTaskDescription("")
      setTaskPriority("")
      setTaskDeadline("")
      setTaskComments("")
    }

  }, [openDialog])

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredTasks = filterStatus === "All"
        ? response.data?.data
        : response.data?.data.filter((task) => task.status === filterStatus);
      setTasks(filteredTasks);
      setHitApi(!hitApi)

    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!taskTitle.trim()) return;
    const newTask = {
      task_title: taskTitle,
      task_description: taskDescription,
      priority: taskPriority,
      deadline: taskDeadline,
      comments: taskComments,
      status: "pending",
    };

    try {
      const response = await axios.post(API_URL, newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([...tasks, response.data]);
      resetForm();
      showSnackbar("Task added successfully!");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async () => {
    if (!taskTitle.trim()) return;
    const updatedTask = {
      task_title: taskTitle,
      task_description: taskDescription,
      priority: taskPriority,
      deadline: taskDeadline,
      comments: taskComments,
      status: taskStatus,
    };

    try {
      await axios.put(`${API_URL}${editingTask.id}/`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map((t) => (t.id === editingTask.id ? { ...t, ...updatedTask } : t)));
      setOpenDialog(false);
      resetForm();
      showSnackbar("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t.id !== id));
      showSnackbar("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setTaskTitle(task.task_title);
    setTaskDescription(task.task_description);
    setTaskPriority(task.priority);
    setTaskDeadline(task.deadline);
    setTaskComments(task.comments);
    setTaskStatus(task.status);
    setOpenDialog(true);
  };

  const resetForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority(null);
    setTaskDeadline(null);
    setTaskComments("");
    setTaskStatus("pending");
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh">
      <Card sx={{ width: "100%", maxWidth: 800, padding: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center">
            Welcome, {user}
          </Typography>
          
          {/* Task input form */}
          <Box display="flex" mb={2}>
            <TextField
              label="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              fullWidth
              sx={{ mr: 2 }}
            />
            <TextField
              label="Task Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              fullWidth
            />
          </Box>

          <Box display="flex" mb={2}>
            <FormControl fullWidth >
              <InputLabel id="demo-simple-select-label">Priority</InputLabel>
              <Select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}  
    label="Priority">
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
              
            </FormControl>
            <TextField
              label="Deadline"
              type="date"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <TextField
            label="Comments"
            value={taskComments}
            onChange={(e) => setTaskComments(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Button onClick={addTask} variant="contained" fullWidth>
            Add Task
          </Button>

          {/* Filter Dropdown */}
          <Box mt={3}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={filterStatus}
                label='Status Filter'
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Task List Display */}
          <Box mt={3}>
            {tasks.length === 0 ? (
              <Typography align="center">No tasks found!</Typography>
            ) : (
              tasks.map((task) => (
                <Paper key={task.id} sx={{ padding: 2, mb: 2, border: "1px solid #ccc", borderRadius: 2 }}>
                  <Box display="flex" flexDirection="column" mb={2}>
                    <Typography variant="h6">{task.task_title}</Typography>
                    <Typography variant="body2">{task.task_description}</Typography>
                    <Typography variant="body2">Priority: {task.priority}</Typography>
                    <Typography variant="body2">Deadline: {task.deadline}</Typography>
                    <Typography variant="body2">Comments: {task.comments}</Typography>
                    <Typography variant="body2" color="textSecondary">Status: {task.status}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <IconButton onClick={() => startEditing(task)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => deleteTask(task.id)}>
                      <DeleteIcon color="secondary" />
                    </IconButton>
                  </Box>
                </Paper>
              ))
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Update Task Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            fullWidth
            sx={{ mb: 2, mt:2 }}
          />
          <TextField
            label="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)} label='Priority'>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Deadline"
            type="date"
            value={taskDeadline}
            onChange={(e) => setTaskDeadline(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Comments"
            value={taskComments}
            onChange={(e) => setTaskComments(e.target.value)}
            fullWidth
            sx={{ mb: 2, mt:2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)} label="Status">
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={updateTask} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success">{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
}

export default TodoApp;
