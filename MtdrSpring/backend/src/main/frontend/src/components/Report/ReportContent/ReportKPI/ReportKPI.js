import './ReportKPI.css';
import { useState } from 'react';
import { Arrow_Down_Icon, Arrow_Up_Icon } from '../../../../Icons';
import ReportKPITasks from './ReportKPITasks/ReportKPITasks';
import ReportKPIHours from './ReportKPIHours/ReportKPIHours';
import ReportKPICombined from './ReportKPICombined/ReportKPICombined';


export default function ReportKPI({ data, moduleData, teamFilter, memberFilter, sprintFilter }) {
    const [hideTasksKPI, setHideTasksKPI] = useState(false);
    const [hideHoursKPI, setHideHoursKPI] = useState(false);
    const [hideKPICombined, setHideKPICombined] = useState(false);
    const [KPITasksData, setKPITasksData] = useState({});
    const [KPIHoursData, setKPIHoursData] = useState({});
    const [KPICombinedData, setKPICombinedData] = useState(null);


    function handle_generate_report() {
        if (teamFilter == 'default') {
            return
        }
        let isMember = false
        let isSprint = false
        if (memberFilter != 'all') {
            isMember = true
        }
        if (sprintFilter != 'all') {
            isSprint = true
        }

        if (isMember && isSprint) {
            generate_report_specific_member_sprint()
        } else if (isMember) {
            generate_report_specific_member()
        } else if (isSprint) {
            generate_report_specific_sprint()
        } else {
            generate_report_all()
        }
    }

    function generate_report_specific_member_sprint() {
        let tasks_to_do = 0
        let tasks_completed = 0
        let stimated_hours = 0
        let worked_hours = 0
        data.filter((user) => {
            return user.teamId == teamFilter && user.user.username == memberFilter
        })
        .map((user) => {
            user.tasksCompleted.map((task) => {
                if (task.moduleId == sprintFilter) {
                    tasks_completed++
                    stimated_hours += task.estimatedTime
                    worked_hours += task.actualTime
                }
            })
            user.uncompletedTasks.map((task) => {
                if (task.moduleId == sprintFilter) {
                    tasks_to_do++
                }
            })
        })
        setKPITasksData({
            tasks_to_do: tasks_to_do,
            tasks_completed: tasks_completed
        })
        setKPIHoursData({
            stimated_hours: stimated_hours,
            worked_hours: worked_hours
        })
        setKPICombinedData({
            tasks_completed,
            worked_hours
        })
    }

    function generate_report_specific_member() {
        let tasks_to_do = 0
        let tasks_completed = 0
        let stimated_hours = 0
        let worked_hours = 0
        
        data.filter((user) => {
            return user.teamId == teamFilter && user.user.username == memberFilter
        })
        .map((user) => {
            user.tasksCompleted.map((task) => {
                tasks_completed++
                stimated_hours += task.estimatedTime
                worked_hours += task.actualTime
            })
            user.uncompletedTasks.map((task) => {
                tasks_to_do++
            })
        })
        setKPITasksData({
            tasks_to_do: tasks_to_do,
            tasks_completed: tasks_completed
        })
        setKPIHoursData({
            stimated_hours: stimated_hours,
            worked_hours: worked_hours
        })
        setKPICombinedData({
            tasks_completed,
            worked_hours
        })
    }
    
    function generate_report_specific_sprint() {
        let tasks_to_do = 0
        let tasks_completed = 0
        let stimated_hours = 0
        let worked_hours = 0
        
        data.filter((user) => {
            return user.teamId == teamFilter
        })
        .map((user) => {
            user.tasksCompleted.map((task) => {
                if (task.moduleId == sprintFilter) {
                    tasks_completed++
                    stimated_hours += task.estimatedTime
                    worked_hours += task.actualTime
                }
            })
            user.uncompletedTasks.map((task) => {
                if (task.moduleId == sprintFilter) {
                    tasks_to_do++
                }
            })
        })
        setKPITasksData({
            tasks_to_do: tasks_to_do,
            tasks_completed: tasks_completed
        })
        setKPIHoursData({
            stimated_hours: stimated_hours,
            worked_hours: worked_hours
        })
        setKPICombinedData({
            tasks_completed,
            worked_hours
        })
    }
    
    function generate_report_all() {
        let tasks_to_do = 0
        let tasks_completed = 0
        let stimated_hours = 0
        let worked_hours = 0
        
        data.filter((user) => {
            return user.teamId == teamFilter
        })
        .map((user) => {
            user.tasksCompleted.map((task) => {
                tasks_completed++
                stimated_hours += task.estimatedTime
                worked_hours += task.actualTime
            })
            user.uncompletedTasks.map((task) => {
                tasks_to_do++
            })
        })
        setKPITasksData({
            tasks_to_do: tasks_to_do,
            tasks_completed: tasks_completed
        })
        setKPIHoursData({
            stimated_hours: stimated_hours,
            worked_hours: worked_hours
        })
        setKPICombinedData({
            tasks_completed,
            worked_hours
        })
    }

    return (
        <div className='kpi-main-content-container'>
            {/* Title Sections Container */}
            <div className='kpi-title-sections-container'>
                <p className='kpi-title-sections-text'>Key Performance Indicators</p>
                {/* Generate Report Button */}
                <div className='kpi-generate-report-button-container'>
                    {/* Button Generate Report */}
                    <button
                        className='kpi-generate-report-button'
                        onClick={() => {handle_generate_report()}}
                    >
                        <p className='kpi-generate-report-button-text'>Generate Report</p>
                    </button>
                </div>
            </div>

            {/* KPI's Sections */}
            <div className='kpi-sections-container'>
                {/* KPI Tasks */}
                <div className='kpi-main-container kpi-first-container'>
                    <div className='kpi-container'>
                        <div className='kpi-title-container'>
                            <p className='kpi-title-container-text'>Tasks</p>
                            <button
                                className='kpi-title-button'
                                onClick={() => {setHideTasksKPI(!hideTasksKPI)}}
                            >
                                {!hideTasksKPI ?
                                    <Arrow_Down_Icon w='25px' h='25px' />
                                    :
                                    <Arrow_Up_Icon w='25px' h='25px' />
                                }
                            </button>
                        </div>

                        {/* KPI Tasks Data */}
                        {!hideTasksKPI && KPITasksData.tasks_to_do != undefined && KPITasksData.tasks_completed != undefined &&
                            <ReportKPITasks KPITasksData={KPITasksData} />
                        }
                    </div>
                </div>

                {/* KPI Hours */}
                <div className='kpi-main-container'>
                    <div className='kpi-title-container'>
                        <p className='kpi-title-container-text'>Hours</p>
                        <button
                            className='kpi-title-button'
                            onClick={() => {setHideHoursKPI(!hideHoursKPI)}}
                        >
                            {!hideHoursKPI ?
                                <Arrow_Down_Icon w='25px' h='25px' />
                                :
                                <Arrow_Up_Icon w='25px' h='25px' />
                            }
                        </button>
                    </div>

                    {/* KPI Tasks Data */}
                    {!hideHoursKPI && KPIHoursData.stimated_hours != undefined && KPIHoursData.worked_hours != undefined &&
                        <ReportKPIHours KPIHoursData={KPIHoursData} />
                    }
                </div>

                {/* KPI Combined */}
                <div className='kpi-main-container'>
                    <div className='kpi-title-container'>
                        <p className='kpi-title-container-text'>Tasks per Hour</p>
                        <button
                            className='kpi-title-button'
                            onClick={() => {setHideKPICombined(!hideKPICombined)}}
                        >
                            {!hideKPICombined ?
                                <Arrow_Down_Icon w='25px' h='25px' />
                                :
                                <Arrow_Up_Icon w='25px' h='25px' />
                            }
                        </button>
                    </div>

                    {/* KPI Combined Data */}
                    {!hideKPICombined && KPICombinedData != null && KPICombinedData.tasks_completed != undefined && KPICombinedData.worked_hours != undefined &&
                        <ReportKPICombined KPICombinedData={KPICombinedData} />
                    }
                </div>
            </div>
        </div>
    )
}