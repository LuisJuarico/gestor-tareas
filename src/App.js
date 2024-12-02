import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState(''); // Nuevo estado para búsqueda

  // Cargar las tareas desde localStorage cuando la página se carga
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  // Guardar las tareas en localStorage cada vez que cambian
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Función para agregar tarea
  const handleAddTask = () => {
    if (task.trim()) {
      const newTask = {
        id: Date.now(),
        text: task,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setTask(''); // Limpiar el campo de entrada después de agregar
    }
  };

  // Función para marcar tarea como completada
  const handleToggleComplete = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Función para eliminar tarea
  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Filtrar las tareas según el estado
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true; // Mostrar todas las tareas
  });

  // Filtrar las tareas por búsqueda
  const searchedTasks = filteredTasks.filter((task) =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <h1 className="text-center mb-4">Gestor de Tareas</h1>

      {/* Barra de búsqueda */}
      <div className="search-bar mb-4">
        <Form.Control
          type="text"
          placeholder="Buscar tarea..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Cambiar el valor de searchTerm
        />
      </div>

      {/* Barra para agregar tarea */}
      <div className="add-task-bar mb-4">
        <Form.Control
          type="text"
          placeholder="Agregar tarea..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <Button variant="primary" onClick={handleAddTask}>
          Agregar
        </Button>
      </div>

      {/* Filtro de tareas */}
      <div className="filter-buttons mb-3">
        <Button variant="primary" onClick={() => setFilter('all')}>Todas</Button>
        <Button variant="success" onClick={() => setFilter('completed')}>Completadas</Button>
        <Button variant="warning" onClick={() => setFilter('pending')}>Pendientes</Button>
      </div>

      {/* Lista de tareas */}
      <ul className="list-group">
        {searchedTasks.map((task) => (
          <li key={task.id} className={`list-group-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-content">
              <span
                style={{ cursor: 'pointer', textDecoration: task.completed ? 'line-through' : 'none' }}
                onClick={() => handleToggleComplete(task.id)}
              >
                {task.text}
              </span>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteTask(task.id)}
              >
                Eliminar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
