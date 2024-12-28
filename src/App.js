import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  NativeSelect,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { Trash } from "tabler-icons-react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskSummary, setTaskSummary] = useState("");
  const [taskState, setTaskState] = useState("Not done");
  const [taskDeadline, setTaskDeadline] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  function createOrUpdateTask() {
    if (editingTaskIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingTaskIndex] = {
        title: taskTitle,
        summary: taskSummary,
        state: taskState,
        deadline: taskDeadline,
      };
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setEditingTaskIndex(null);
    } else {
      const newTask = {
        title: taskTitle,
        summary: taskSummary,
        state: taskState,
        deadline: taskDeadline,
      };
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, newTask];
        saveTasks(updatedTasks);
        return updatedTasks;
      });
    }
    clearForm();
    setOpened(false);
  }

  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  function sortTasksByState(state) {
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.state === state) return -1;
      if (b.state === state) return 1;
      return 0;
    });
    setTasks(sortedTasks);
  }

  function filterTasksByState(state) {
    const filteredTasks = tasks.filter((task) => task.state === state);
    setTasks(filteredTasks);
  }

  function sortTasksByDeadline() {
    const sortedTasks = [...tasks].sort(
      (a, b) => new Date(a.deadline) - new Date(b.deadline)
    );
    setTasks(sortedTasks);
  }

  function clearForm() {
    setTaskTitle("");
    setTaskSummary("");
    setTaskState("Not done");
    setTaskDeadline("");
  }

  function loadTasks() {
    const loadedTasks = localStorage.getItem("tasks");
    if (loadedTasks) {
      setTasks(JSON.parse(loadedTasks));
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  return (
    <div className="App">
      <Modal
        opened={opened}
        size={"md"}
        title={editingTaskIndex !== null ? "Edit Task" : "New Task"}
        onClose={() => {
          setOpened(false);
          setEditingTaskIndex(null);
        }}
        centered
      >
        <TextInput
          mt={"md"}
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.currentTarget.value)}
          placeholder={"Task Title"}
          required
          label={"Title"}
        />
        <TextInput
          mt={"md"}
          value={taskSummary}
          onChange={(e) => setTaskSummary(e.currentTarget.value)}
          placeholder={"Task Summary"}
          label={"Summary"}
        />
        <NativeSelect
          mt={"md"}
          value={taskState}
          onChange={(e) => setTaskState(e.currentTarget.value)}
          data={["Done", "Not done", "Doing right now"]}
          label="State"
        />
        <input
          type="date"
          mt={"md"}
          value={taskDeadline}
          onChange={(e) => setTaskDeadline(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            marginTop: "16px",
          }}
        />
        <Group mt={"md"} position={"apart"}>
          <Button
            onClick={() => {
              setOpened(false);
              setEditingTaskIndex(null);
            }}
            variant={"subtle"}
          >
            Cancel
          </Button>
          <Button onClick={createOrUpdateTask}>
            {editingTaskIndex !== null ? "Update Task" : "Create Task"}
          </Button>
        </Group>
      </Modal>
      <Container size={550} my={40}>
        <Title>My Tasks</Title>
        <Group mt={"md"}>
          <Button onClick={() => sortTasksByState("Done")}>
            Show 'Done' first
          </Button>
          <Button onClick={() => sortTasksByState("Doing right now")}>
            Show 'Doing' first
          </Button>
          <Button onClick={() => sortTasksByState("Not done")}>
            Show 'Not done' first
          </Button>
        </Group>
        <Group mt={"md"}>
          <Button onClick={() => filterTasksByState("Done")}>
            Show only 'Done'
          </Button>
          <Button onClick={() => filterTasksByState("Not done")}>
            Show only 'Not done'
          </Button>
          <Button onClick={() => filterTasksByState("Doing right now")}>
            Show only 'Doing'
          </Button>
          <Button onClick={sortTasksByDeadline}>Sort by deadline</Button>
        </Group>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <Card withBorder key={index} mt={"sm"}>
              <Group position={"apart"}>
                <Text weight={"bold"}>{task.title}</Text>
                <Group>
                  <ActionIcon
                    onClick={() => {
                      setEditingTaskIndex(index);
                      setTaskTitle(task.title);
                      setTaskSummary(task.summary);
                      setTaskState(task.state);
                      setTaskDeadline(task.deadline);
                      setOpened(true);
                    }}
                    color={"blue"}
                  >
                    Edit
                  </ActionIcon>
                  <ActionIcon
                    onClick={() => deleteTask(index)}
                    color={"red"}
                  >
                    <Trash />
                  </ActionIcon>
                </Group>
              </Group>
              <Text>{task.summary}</Text>
              <Text>State: {task.state}</Text>
              <Text>Deadline: {task.deadline || "No deadline"}</Text>
            </Card>
          ))
        ) : (
          <Text>No tasks available</Text>
        )}
        <Button
          fullWidth
          mt={"md"}
          onClick={() => {
            clearForm();
            setOpened(true);
          }}
        >
          New Task
        </Button>
      </Container>
    </div>
  );
}
