import './ReportKPITasks.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ReportKPITasks({ KPITasksData = {} }) {
  const tasksToDo = KPITasksData?.tasks_to_do || 0;
  const tasksCompleted = KPITasksData?.tasks_completed || 0;

  const data = [
    {
      'To Do': tasksToDo,
      'Completed': tasksCompleted,
    }
  ];

  const total = tasksToDo + tasksCompleted;
  const completionPercentage = total > 0 
    ? Math.round((tasksCompleted / total) * 100) 
    : 0;

  return (
    <div className="report-kpi-tasks-main-container">
      <div className="report-kpi-stats">
        <div className="stat-card todo-card">
          <p className="stat-label-tasks">To Do</p>
          <p className="stat-value todo-value">{tasksToDo}</p>
        </div>
        
        <div className="stat-card completed-card">
          <p className="stat-label-tasks">Completed</p>
          <p className="stat-value completed-value">{tasksCompleted}</p>
        </div>
        
        <div className="stat-card percentage-card-tasks">
          <p className="stat-label-tasks">Percentage</p>
          <p className="stat-value percentage-value-tasks">{completionPercentage}%</p>
        </div>
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="To Do" fill="#505050" />
            <Bar dataKey="Completed" fill="#b91010" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}