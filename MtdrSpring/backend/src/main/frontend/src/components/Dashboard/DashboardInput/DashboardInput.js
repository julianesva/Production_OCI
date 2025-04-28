import "./DashboardInput.css";
import { useState, useEffect } from "react";
import { API_MODULES } from "../../../API";

export default function DashboardInput({
  employeesList,
  addItem,
  isInserting,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsible, setResponsible] = useState("");
  const [storyPoints, setStoryPoints] = useState("");
  const [hours, setHours] = useState("");
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);

  const clearFields = () => {
    setTitle("");
    setDescription("");
    setResponsible("");
    setStoryPoints("");
    setHours("");
    setSelectedModule(null);
  };

  function handleSubmit(e) {
    e.preventDefault();

    // Check if all required fields are filled
    if (
      isInserting ||
      !title ||
      !description ||
      !responsible ||
      !storyPoints ||
      !hours ||
      !selectedModule
    ) {
      return;
    }

    const data = {
      title: title,
      description: description,
      story_Points: storyPoints,
      estimatedTime: hours,
      done: 0,
      moduleId: selectedModule.id,
      responsible: responsible,
    };

    addItem(data);
    clearFields();
  }

  useEffect(() => {
    fetch(API_MODULES)
      .then((response) => response.json())
      .then((data) => setModules(data))
      .catch((error) => console.error("Error fetching modules:", error));
  }, []);

  return (
    <div className="dashboard-input-container">
      {/* Input Title */}
      <input
        type="text"
        className="dashboard-input-format"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit(e);
          }
        }}
      />

      {/* Input Description */}
      <input
        type="text"
        className="dashboard-input-format description-input"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit(e);
          }
        }}
      />

      {/* Select Responsible */}
      <select
        className="dashboard-input-format dashboard-module-select-input"
        value={responsible}
        onChange={(e) => setResponsible(e.target.value)}
      >
        <option value="" disabled selected>
          Responsible
        </option>
        {employeesList &&
          employeesList.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.user.username}
            </option>
          ))}
      </select>

      {/* Input Story Points */}
      <input
        type="number"
        className="dashboard-input-format num-input"
        placeholder="Story Points"
        min={1}
        max={10}
        value={storyPoints}
        onChange={(e) => setStoryPoints(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit(e);
          }
        }}
      />

      {/* Input Hours */}
      <input
        type="number"
        className="dashboard-input-format num-input"
        placeholder="Hours"
        min={1}
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit(e);
          }
        }}
      />

      {/* Select Module */}
      <select
        className="dashboard-input-format dashboard-module-select-input"
        id="moduleSelect"
        data-testid="module-select"
        value={selectedModule ? selectedModule.id : ""}
        onChange={(e) => {
          const moduleId = e.target.value;
          const module = modules.find((m) => m.id === parseInt(moduleId, 10));
          setSelectedModule(module);
        }}
      >
        <option value="" disabled selected>
          Sprint
        </option>
        {modules &&
          [...modules]
            .sort((a, b) => a.id - b.id)
            .map((module) => (
              <option key={module.id} value={module.id}>
                {module.id} - {module.title}
              </option>
            ))}
      </select>

      {/* Search Button */}
      <button
        className="dashboard-input-button"
        onClick={handleSubmit}
        disabled={isInserting}
      >
        <p className="dashboard-input-button-text">Add</p>
      </button>
    </div>
  );
}
