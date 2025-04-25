import './DashboardContent.css'
import { useState } from 'react';
import DashboardInput from '../DashboardInput/DashboardInput';
import DashboardTasksTable from '../DashboardTasksTables/DashboardTasksTable';
import RecommendationPopup from '../../../RecommendationPopup';

export default function DashboardContent({ tasklist, addItem, isInserting, toggleDone, deleteItem, modules }) {
    const [moduleFilter, setModuleFilter] = useState('all');

    return (
        <div className="dashboard-main-content">
            <div className='dashboard-main-content-container'>
                {/* Welcome Text */}
                <p className='welcome-text'>Welcome Back Santiago!</p>

                {/* Title & Recommendation Button */}
                <div className='dashboard-title-container'>
                    {/* Title Text */}
                    <p className='dashboard-title-text'>Dashboard</p>

                    {/* Recommendation Button */}
                    <RecommendationPopup items={tasklist} />
                </div>

                {/* Dashboard Input */}
                <DashboardInput addItem={addItem} isInserting={isInserting} />

                {/* Dashboard Select Module */}
                <div className="filter-module-container">
                    <p className='filter-module-title-text'>Filter by Module:</p>
                    <select className='filter-module-select' value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}>
                        <option value="all">All</option>
                        {modules.map((module) => (
                            <option key={module.id} value={module.id}>
                                {module.id} - {module.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* To Do Table */}
                <DashboardTasksTable taskList={tasklist} moduleFilter={moduleFilter} filter={0} title={"To Do"} action={"Done"} toggleDone={toggleDone} deleteItem={deleteItem} />

                {/* Completed Table */}
                <DashboardTasksTable taskList={tasklist} moduleFilter={moduleFilter} filter={1} title={"Completed"} action={"Undo"} toggleDone={toggleDone} deleteItem={deleteItem} />

                {/* To Do Table - To be fixed with integer done colum
                <DashboardTasksTable taskList={tasklist} moduleFilter={moduleFilter} filter={0} title={"To Do"} action={"Start"} toggleDone={toggleDone} deleteItem={deleteItem} /> */}

                {/* In Progress Table - To be fixed with integer done colum
                <DashboardTasksTable taskList={tasklist} filter={1} title={"In Progress"} action={"Done"} toggleDone={toggleDone} deleteItem={deleteItem} /> */}

                {/* Completed Table - To be fixed with integer done colum
                <DashboardTasksTable taskList={tasklist} filter={2} title={"Completed"} action={"Undo"} toggleDone={toggleDone} deleteItem={deleteItem} /> */}
            </div>
        </div>
    );
}