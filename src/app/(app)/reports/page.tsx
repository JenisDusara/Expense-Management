'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Jan',
    approved: 4000,
    rejected: 2400,
  },
  {
    name: 'Feb',
    approved: 3000,
    rejected: 1398,
  },
  {
    name: 'Mar',
    approved: 2000,
    rejected: 9800,
  },
  {
    name: 'Apr',
    approved: 2780,
    rejected: 3908,
  },
  {
    name: 'May',
    approved: 1890,
    rejected: 4800,
  },
  {
    name: 'Jun',
    approved: 2390,
    rejected: 3800,
  },
  {
    name: 'Jul',
    approved: 3490,
    rejected: 4300,
  },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Reports" description="Analyze spending trends and patterns." />
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spend</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
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
                <Bar dataKey="approved" fill="hsl(var(--primary))" name="Approved" />
                <Bar dataKey="rejected" fill="hsl(var(--destructive))" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
