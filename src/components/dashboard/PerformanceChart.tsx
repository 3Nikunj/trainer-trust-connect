
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceData {
  month: string;
  applications: number;
  interviews: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
        <CardDescription>
          Track your application success rate over time
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="applications" name="Applications" fill="#3B82F6" />
            <Bar dataKey="interviews" name="Interviews" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
