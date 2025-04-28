import "./DashboardTasksTable.css";
import { useState, useEffect } from "react";
import { Arrow_Down_Icon, Arrow_Up_Icon, Trash_Icon } from "../../../Icons";

export default function DashboardTasksTable({
  items,
  employeesList,
  moduleFilter,
  filter,
  title,
  action,
  handle_set_Real_Hours,
  deleteItem,
  setIsHiddenRealHours,
}) {
  const [isHidden, setIsHidden] = useState(false);

  function handleNextButton(event, task) {
    if (task.done == 0) {
      setIsHiddenRealHours(false);
      handle_set_Real_Hours(
        event,
        task.id,
        task.title,
        task.description,
        1,
        task.estimatedTime,
        task.story_Points,
        task.moduleId
      );
    } else if (task.done == 1) {
      handle_set_Real_Hours(
        event,
        task.id,
        task.title,
        task.description,
        0,
        task.estimatedTime,
        task.story_Points,
        task.moduleId
      );
    } // else if (task.done == 2) {
    //     handle_set_Real_Hours(event, task.id, task.title, task.description, 0, task.estimatedTime, task.story_Points)
    // }
    else {
      console.error("Invalid task status:", task.done);
    }
  }

  function get_user_by_id(id) {
    const user = employeesList.find((user) => user.id == id);
    return user ? user.user.username : "";
  }

  useEffect(() => {}, [moduleFilter]);

  return (
    <div className="dashboard-table-container">
      {/* Table Title and Hidde | Unhidde Button */}
      <div className="dashboard-table-title-container">
        {/* Table Title */}
        <p className="dashboard-table-title">{title}</p>

        {/* Hidden | Unhidden Button */}
        <button onClick={() => setIsHidden(!isHidden)}>
          {isHidden ? (
            <Arrow_Up_Icon w="25px" h="25px" />
          ) : (
            <Arrow_Down_Icon w="25px" h="25px" />
          )}
        </button>
      </div>

      {/* Big Bottom Outline */}
      <div className="dashboard-table-big-separation">
        {/* Hidden | Unhidden Table */}
        {isHidden ? null : !employeesList ? (
          <div className="dashboard-table-empty">
            <p className="dashboard-table-empty-text">All clear</p>
          </div>
        ) : (
          <div className="dashboard-table-separation">
            <table className="dashboard-table-task-table">
              <thead>
                <tr>
                  <th className="dashboard-table-task-table-head-left">
                    Title
                  </th>
                  <th className="dashboard-table-task-table-head-left dashboard-table-border-inline">
                    Description
                  </th>
                  <th className="dashboard-table-task-table-head-left dashboard-table-border-inline">
                    Responsible
                  </th>
                  <th className="dashboard-table-task-table-head-center dashboard-table-border-inline">
                    Hours
                  </th>
                  {title == "Completed" && (
                    <th className="dashboard-table-task-table-head-center dashboard-table-border-inline">
                      Real Hours
                    </th>
                  )}
                  <th className="dashboard-table-task-table-head-center dashboard-table-border-inline">
                    Story Points
                  </th>
                  <th className="dashboard-table-task-table-head-actions">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items
                  .filter((task) => {
                    if (moduleFilter == "all") {
                      return task.done == filter;
                    } else {
                      return (
                        task.done == filter && task.moduleId == moduleFilter
                      );
                    }
                  })
                  .map((task) => (
                    <tr key={task.id} className="dashboard-table-row">
                      <td className="dashboard-table-text-column dashboard-table-title-column">
                        {task.title}
                      </td>
                      <td className="dashboard-table-text-column dashboard-table-description-column dashboard-table-border-inline">
                        {task.description}
                      </td>
                      <td className="dashboard-table-text-column dashboard-table-responsible-column dashboard-table-border-inline">
                        {get_user_by_id(task.responsible)}
                      </td>
                      <td className="dashboard-table-num-column dashboard-table-border-inline">
                        {task.estimatedTime}
                      </td>
                      {title == "Completed" && (
                        <td className="dashboard-table-num-column dashboard-table-border-inline">
                          {task.actualTime}
                        </td>
                      )}
                      <td className="dashboard-table-num-column dashboard-table-border-inline">
                        {task.story_Points}
                      </td>
                      <td className="dashboard-table-actions-column">
                        <div className="dashboard-table-actions-container">
                          {/* Next Button */}
                          <button
                            className="dashboard-table-action-next-button"
                            onClick={(event) => handleNextButton(event, task)}
                          >
                            {action}
                          </button>
                          {/* Delete Button */}
                          <button
                            className="dashboard-table-action-trash-button"
                            onClick={() => deleteItem(task.id)}
                          >
                            <Trash_Icon color="white" w="16px" h="16px" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
