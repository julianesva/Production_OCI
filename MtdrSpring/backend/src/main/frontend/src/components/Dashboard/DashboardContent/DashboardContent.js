import './DashboardContent.css'
import { useState } from 'react';
import DashboardInput from '../DashboardInput/DashboardInput';
import DashboardTasksTable from '../DashboardTasksTables/DashboardTasksTable';
import RecommendationPopup from '../../../RecommendationPopup';
import DashboardRealHours from '../DashboardTasksTables/DashboardRealHours/DashboardRealHours';

export default function DashboardContent({ items, employeesList, addItem, isInserting, toggleDone, deleteItem, modules }) {
    const [moduleFilter, setModuleFilter] = useState('all');
    const [isHiddenRealHours, setIsHiddenRealHours] = useState(true);
    const [taskData, setTaskData] = useState({});

    function handle_set_Real_Hours(event, id, title, description, done, estimatedTime, story_Points, moduleId) {
        event.preventDefault();
        setTaskData({ id, title, description, done, estimatedTime, story_Points, moduleId });
    }

    function confirm_Real_Hours(realHours) {
        const newData = {
            ...taskData,
            actualTime: parseInt(realHours, 10),
        }
        toggleDone(newData);
        setIsHiddenRealHours(true);
    }

    return (
        <>
            <div className="dashboard-main-content">
                <div className='dashboard-main-content-container'>
                    {/* Title & Recommendation Button */}
                    <div className='dashboard-title-container'>
                        {/* Title Text */}
                        <p className='dashboard-title-text'>Dashboard</p>

                        {/* Recommendation Button */}
                        <RecommendationPopup items={items} />
                    </div>

                    {/* Dashboard Input */}
                    <DashboardInput employeesList={employeesList} addItem={addItem} isInserting={isInserting} />

                    {/* Dashboard Select Module */}
                    <div className="filter-module-container">
                        <p className='filter-module-title-text'>Filter by Sprint:</p>
                        <select className='filter-module-select' value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}>
                            <option value="all">All</option>
                            {modules &&
                                [...modules]
                                    .sort((a, b) => a.id - b.id)
                                    .map((module) => (
                                        <option key={module.id} value={module.id}>
                                            {module.id} - {module.title}
                                        </option>
                                    ))
                            }
                        </select>
                    </div>

                    {/* To Do Table */}
                    <DashboardTasksTable items={items} employeesList={employeesList} moduleFilter={moduleFilter} filter={0} title={"To Do"} action={"Done"} handle_set_Real_Hours={handle_set_Real_Hours} deleteItem={deleteItem} setIsHiddenRealHours={setIsHiddenRealHours} />

                    {/* Completed Table */}
                    <DashboardTasksTable items={items} employeesList={employeesList} moduleFilter={moduleFilter} filter={1} title={"Completed"} action={"Undo"} handle_set_Real_Hours={handle_set_Real_Hours} deleteItem={deleteItem} />

                    {/* To Do Table - To be fixed with integer done colum
                    <DashboardTasksTable taskList={tasklist} moduleFilter={moduleFilter} filter={0} title={"To Do"} action={"Start"} toggleDone={toggleDone} deleteItem={deleteItem} /> */}

                    {/* In Progress Table - To be fixed with integer done colum
                    <DashboardTasksTable taskList={tasklist} filter={1} title={"In Progress"} action={"Done"} toggleDone={toggleDone} deleteItem={deleteItem} /> */}

                    {/* Completed Table - To be fixed with integer done colum
                    <DashboardTasksTable taskList={tasklist} filter={2} title={"Completed"} action={"Undo"} toggleDone={toggleDone} deleteItem={deleteItem} /> */}
                </div>
            </div>

            {/* Real Hours Popup */}
            {!isHiddenRealHours &&
                <DashboardRealHours isHidden={setIsHiddenRealHours} confirm_Real_Hours={confirm_Real_Hours} />
            }
        </>
    );
}