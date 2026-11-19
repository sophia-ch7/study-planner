import { Header } from "./components/Header";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TaskStats } from "./components/TaskStats";
import { TaskFilters } from "./components/TaskFilters";
import { Toast } from "./components/Toast";
import { TaskProvider } from "./context/TaskContext";
import { useTaskContext } from "./hooks/useTaskContext";

function MainContent() {
  const { toast, hideToast, clearCompleted, resetTasks } = useTaskContext();

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Header />
          <TaskStats />
          <TaskForm />
          <TaskFilters />
          <TaskList />

          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={clearCompleted}
            >
              Очистити виконані
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={resetTasks}
            >
              Скинути дані
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          subMessage={toast.subMessage}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          onClose={hideToast}
          duration={toast.duration}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <MainContent />
    </TaskProvider>
  );
}
