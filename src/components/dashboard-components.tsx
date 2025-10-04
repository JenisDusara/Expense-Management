'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import * as LucideIcons from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Expense } from "@/lib/definitions";
import { useMemo } from "react";
import { Skeleton } from "./ui/skeleton";

type StatCardProps = {
    title: string
    value: string
    iconName: keyof typeof LucideIcons;
    isLoading?: boolean;
}

export function StatCard({ title, value, iconName, isLoading }: StatCardProps) {
    const Icon = LucideIcons[iconName] as LucideIcons.LucideIcon;
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
            </CardContent>
        </Card>
    )
}

const chartConfig = {
  approved: {
    label: "Approved",
    color: "hsl(var(--chart-1))",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-2))",
  },
}

export function ExpensesChart({ expenses, isLoading }: { expenses: Expense[], isLoading?: boolean }) {
    const chartData = useMemo(() => {
        if (!expenses) return [];

        const monthlyData: { [key: string]: { month: string; approved: number; rejected: number } } = {};

        expenses.forEach(expense => {
            const expenseDate = new Date(expense.date);
            if (isNaN(expenseDate.getTime())) return;
            const month = expenseDate.toLocaleString('default', { month: 'short' });
            if (!monthlyData[month]) {
                monthlyData[month] = { month, approved: 0, rejected: 0 };
            }
            if (expense.status === 'Approved') {
                monthlyData[month].approved += expense.amount;
            } else if (expense.status === 'Rejected') {
                monthlyData[month].rejected += expense.amount;
            }
        });

        // Ensure we have data for the last 6 months, even if it's zero
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return d.toLocaleString('default', { month: 'short' });
        }).reverse();

        return last6Months.map(month => monthlyData[month] || { month, approved: 0, rejected: 0 });

    }, [expenses]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Expense Overview</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-[250px] w-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis tickFormatter={(value) => `$${value}`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="approved" fill="var(--color-approved)" radius={4} />
                            <Bar dataKey="rejected" fill="var(--color-rejected)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
