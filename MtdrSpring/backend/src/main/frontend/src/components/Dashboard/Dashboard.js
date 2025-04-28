import "./Dashboard.css";
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import DashboardContent from "./DashboardContent/DashboardContent";
import { API_HEADERS, API_LIST, API_EMPLOYEES, API_MODULES } from "../../API";

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isInserting, setInserting] = useState(false);
  const [items, setItems] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [error, setError] = useState();
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("all");

  function deleteItem(deleteId) {
    fetch(API_LIST + "/" + deleteId, {
      method: "DELETE",
      headers: API_HEADERS,
    })
      .then((response) => {
        if (response.ok) {
          return response;
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then(
        (result) => {
          const remainingItems = items.filter((item) => item.id !== deleteId);
          setItems(remainingItems);
        },
        (error) => {
          setError(error);
        }
      );
  }

  function toggleDone(taskData) {
    modifyItem(
      taskData.id,
      taskData.title,
      taskData.description,
      taskData.done,
      taskData.estimatedTime,
      taskData.story_Points,
      taskData.moduleId,
      taskData.actualTime
    ).then(
      (result) => {
        reloadOneIteam(taskData.id);
      },
      (error) => {
        setError(error);
      }
    );
  }

  function modifyItem(
    id,
    title,
    description,
    done,
    estimatedTime,
    story_Points,
    moduleId,
    actualTime
  ) {
    let data = {
      title: title,
      description: description,
      estimatedTime: estimatedTime,
      done: done,
      story_Points: story_Points,
      moduleId: moduleId,
      actualTime: actualTime,
    };
    return fetch(API_LIST + "/" + id, {
      method: "PUT",
      headers: API_HEADERS,
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        return response;
      } else {
        throw new Error("Something went wrong ...");
      }
    });
  }

  function reloadOneIteam(id) {
    fetch(API_LIST + "/" + id, {
      headers: API_HEADERS,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then(
        (result) => {
          const items2 = items.map((x) =>
            x.id === id
              ? {
                  ...x,
                  title: result.title,
                  description: result.description,
                  done: result.done,
                  creation_ts: result.creation_ts,
                  estimatedTime: result.estimatedTime,
                  story_Points: result.story_Points,
                  moduleId: result.moduleId,
                  actualTime: result.actualTime,
                }
              : x
          );
          setItems(items2);
        },
        (error) => {
          setError(error);
        }
      );
  }

  function addItem(data) {
    setInserting(true);
    fetch(API_LIST, {
      method: "POST",
      headers: API_HEADERS,
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response;
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then(
        (result) => {
          var id = result.headers.get("location");
          var newItem = {
            id: id,
            title: data.title,
            description: data.description,
            estimatedTime: data.estimatedTime,
            done: data.done,
            story_Points: data.story_Points,
            moduleId: data.moduleId,
            responsible: data.responsible,
          };
          setItems([newItem, ...items]);
          setInserting(false);
        },
        (error) => {
          setInserting(false);
          setError(error);
        }
      );
  }

  function handleModuleChange(event) {
    setSelectedModule(event.target.value);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      fetch(API_LIST, {
        headers: API_HEADERS,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Something went wrong loading Tasks...");
          }
        })
        .then(
          (result) => {
            console.log("API Tasks:", result);
            setItems(result);
          },
          (error) => {
            setError(error);
            setLoading(false);
          }
        );

      fetch(API_EMPLOYEES, {
        headers: API_HEADERS,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Something went wrong loading Employees...");
          }
        })
        .then(
          (result) => {
            console.log("API Employees", result);
            setEmployeesList(result);
          },
          (error) => {
            setError(error);
            setLoading(false);
          }
        );

      fetch(API_MODULES, {
        headers: API_HEADERS,
      })
        .then((response) =>
          response.ok
            ? response.json()
            : Promise.reject("Error fetching modules")
        )
        .then((result) => {
          setModules(result);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    };

    fetchData();
  }, [refresh]);

  return (
    <div className="dashboard-main">
      {/* Loading OR Dashboard */}
      {isLoading ? (
        // Loading
        <div className="dashboard-loading">
          <CircularProgress />
        </div>
      ) : error ? (
        // Error
        <div className="dashboard-error">
          <p className="dashboard-error-text">Error: {error}</p>
        </div>
      ) : (
        // Dashboard
        <div className="dashboard-main-container">
          <DashboardContent
            items={items}
            employeesList={employeesList}
            addItem={addItem}
            isInserting={isInserting}
            toggleDone={toggleDone}
            deleteItem={deleteItem}
            modules={modules}
            selectedModule={selectedModule}
            handleModuleChange={handleModuleChange}
          />
        </div>
      )}
    </div>
  );
}
