import './ReportKPIHours.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ReportKPIHours({ KPIHoursData = {} }) {
  const stimated_hours = KPIHoursData?.stimated_hours || 0;
  const worked_hours = KPIHoursData?.worked_hours || 0;

  const data = [
    {
      'Estimated': stimated_hours,
      'Worked': worked_hours,
    }
  ];

  const percentage = stimated_hours > 0 
    ? Math.round((worked_hours / stimated_hours) * 100) 
    : 0;

  const diffHours = worked_hours - stimated_hours;
  const diffText = diffHours >= 0 
    ? `+${diffHours}h` 
    : `${diffHours}h`;

  return (
    <div className="report-kpi-hours-main-container">
      <div className="report-kpi-stats">
        <div className="stat-card estimated-card">
          <p className="stat-label">Estimated Hours</p>
          <p className="stat-value estimated-value">{stimated_hours}</p>
        </div>
        
        <div className="stat-card worked-card">
          <p className="stat-label">Worked Hours</p>
          <p className="stat-value worked-value">{worked_hours}</p>
        </div>
        
        <div className="stat-card difference-card">
          <p className="stat-label">Difference</p>
          <p className="stat-value difference-value">{diffText} ({percentage}%)</p>
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
            <Bar dataKey="Estimated" fill="#505050" />
            <Bar dataKey="Worked" fill="#b91010" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}