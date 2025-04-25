import './DashboardTasksTable.css'
import { useState, useEffect } from 'react'
import { Arrow_Down_Icon, Arrow_Up_Icon, Trash_Icon } from '../../../Icons'

export default function DashboardTasksTable({ taskList, moduleFilter, filter, title, action, toggleDone, deleteItem }) {
    const [isHidden, setIsHidden] = useState(false);

    function handleNextButton(event, task) {
        if (task.done == 0) {
            toggleDone(event, task.id, task.title, task.description, 1, task.estimatedTime, task.story_Points, task.moduleId)
        } else if (task.done == 1) {
            toggleDone(event, task.id, task.title, task.description, 0, task.estimatedTime, task.story_Points, task.moduleId)
        } // else if (task.done == 2) {
        //     toggleDone(event, task.id, task.title, task.description, 0, task.estimatedTime, task.story_Points)
        // }
        else {
            console.error("Invalid task status:", task.done)
        }
    }

    useEffect(() => {
    }, [moduleFilter])
    
    return (
        <div className='dashboard-table-container'>
            {/* Table Title and Hidde | Unhidde Button */}
            <div className='dashboard-table-title-container'>
                {/* Table Title */}
                <p className='dashboard-table-title'>{title}</p>

                {/* Hidden | Unhidden Button */}
                <button onClick={() => setIsHidden(!isHidden)}>
                    {isHidden ?
                        <Arrow_Up_Icon w='25px' h='25px' />
                        :
                        <Arrow_Down_Icon w='25px' h='25px' />
                    }
                </button>
            </div>

            {/* Big Bottom Outline */}
            <div className='dashboard-table-big-separation'>
                {/* Hidden | Unhidden Table */}
                {isHidden ? null :
                    taskList.length == 0 ?
                        <div className='dashboard-table-empty'>
                            <p className='dashboard-table-empty-text'>All clear</p>
                        </div>
                    :
                        <div className='dashboard-table-separation'>
                            <table className="dashboard-table-task-table">
                                <thead>
                                    <tr>
                                        <th className='dashboard-table-task-table-head-left'>Title</th>
                                        <th className='dashboard-table-task-table-head-left'>Description</th>
                                        <th className='dashboard-table-task-table-head-center'>Hours</th>
                                        <th className='dashboard-table-task-table-head-center'>Story Points</th>
                                        <th className='dashboard-table-task-table-head-actions'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {taskList.filter(task => {
                                    if (moduleFilter == 'all') {
                                        return task.done == filter;
                                    } else {
                                        return task.done == filter && task.moduleId == moduleFilter;
                                    }
                                }).map(task => (
                                    <tr key={task.id} className='dashboard-table-row'>
                                    <td className='dashboard-table-text-column'>{task.title}</td>
                                    <td className='dashboard-table-text-column'>{task.description}</td>
                                    <td className='dashboard-table-num-column'>{task.estimatedTime}</td>
                                    <td className='dashboard-table-num-column'>{task.story_Points}</td>
                                    <td className='dashboard-table-actions-column'>
                                        <div className='dashboard-table-actions-container'>
                                        {/* Next Button */}
                                        <button className='dashboard-table-action-next-button' onClick={(event) => handleNextButton(event, task)}>
                                            {action}
                                        </button>
                                        {/* Delete Button */}
                                        <button className='dashboard-table-action-trash-button' onClick={() => deleteItem(task.id)}>
                                            <Trash_Icon color='white' w='16px' h='16px' />
                                        </button>
                                        </div>
                                    </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                }
            </div>
        </div>
    )
}