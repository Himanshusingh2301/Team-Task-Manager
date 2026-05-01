import { format, isPast, isToday } from "date-fns";

export function formatDate(value) {
  if (!value) {
    return "No due date";
  }

  return format(new Date(value), "dd MMM yyyy");
}

export function getTaskStatusLabel(status) {
  return {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done"
  }[status];
}

export function getDueState(task) {
  if (!task.dueDate || task.status === "done") {
    return "neutral";
  }

  const date = new Date(task.dueDate);

  if (isPast(date) && !isToday(date)) {
    return "overdue";
  }

  if (isToday(date)) {
    return "today";
  }

  return "upcoming";
}
