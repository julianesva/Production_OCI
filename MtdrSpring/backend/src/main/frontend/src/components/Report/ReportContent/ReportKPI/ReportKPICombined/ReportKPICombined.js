import './ReportKPICombined.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ReportKPICombined({ KPICombinedData = {} }) {
  const tasksCompleted = KPICombinedData?.tasks_completed || 0;
  const workedHours = KPICombinedData?.worked_hours || 0;

  const averageTasksPerHour = workedHours > 0
    ? (tasksCompleted / workedHours).toFixed(2)
    : 0;

  const data = [
    {
      'Worked Hours': workedHours,
      'Completed Tasks': tasksCompleted,
    }
  ];

  return (
    <div className="report-kpi-combined-main-container">
      <div className="report-kpi-stats">
        <div className="stat-card worked-card-combined">
          <p className="stat-label-tasks">Worked Hours</p>
          <p className="stat-value worked-value-combined">{workedHours}</p>
        </div>

        <div className="stat-card completed-card-combined">
          <p className="stat-label-tasks">Completed Tasks</p>
          <p className="stat-value completed-value-combined">{tasksCompleted}</p>
        </div>

        <div className="stat-card percentage-card-tasks">
          <p className="stat-label-tasks">Tasks per Hour</p>
          <p className="stat-value percentage-value-tasks">{averageTasksPerHour}</p>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Worked Hours" fill="#505050" />
            <Bar dataKey="Completed Tasks" fill="#b91010" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
