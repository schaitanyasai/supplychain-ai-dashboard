
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Card from '../components/Card';
import { getDashboardKpis, getInventoryDistribution, getCostBreakdown } from '../services/mockApiService';
import { KPIs, InventoryDistributionItem, CostBreakdownItem } from '../types';
import { LoadingSpinner } from '../components/icons';

const KpiCard: React.FC<{ title: string; value: string | number; unit: string; description: string }> = ({ title, value, unit, description }) => (
    <Card className="flex flex-col">
        <div className="flex-grow">
            <h3 className="text-lg font-medium text-gray-400">{title}</h3>
            <p className="text-4xl font-bold text-dark-content mt-2">
                {value}
                <span className="text-2xl font-medium text-gray-300 ml-2">{unit}</span>
            </p>
        </div>
        <p className="text-sm text-gray-400 mt-4">{description}</p>
    </Card>
);

const COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


const Dashboard: React.FC = () => {
    const [kpis, setKpis] = useState<KPIs | null>(null);
    const [inventoryDistribution, setInventoryDistribution] = useState<InventoryDistributionItem[]>([]);
    const [costBreakdown, setCostBreakdown] = useState<CostBreakdownItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [kpisData, inventoryData, costData] = await Promise.all([
                    getDashboardKpis(),
                    getInventoryDistribution(),
                    getCostBreakdown()
                ]);
                setKpis(kpisData);
                setInventoryDistribution(inventoryData);
                setCostBreakdown(costData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <LoadingSpinner className="w-12 h-12 text-brand-secondary" />
            </div>
        );
    }

    if (!kpis) {
        return <p>Error loading dashboard data.</p>;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <KpiCard
                    title="Total Logistics Cost"
                    value={`$${(kpis.totalCost / 1000000).toFixed(2)}`}
                    unit="M"
                    description="Total cost for transportation and inventory in the last period."
                />
                <KpiCard
                    title="Customer Service Level"
                    value={kpis.serviceLevel.toFixed(1)}
                    unit="%"
                    description="On-time, in-full order fulfillment rate."
                />
                 <KpiCard
                    title="Cost Savings"
                    value={kpis.costSavings.toFixed(1)}
                    unit="%"
                    description="Reduction in total cost vs. non-optimized baseline."
                />
                <KpiCard
                    title="Inventory Turns"
                    value={kpis.inventoryTurns.toFixed(1)}
                    unit=""
                    description="Number of times inventory is sold over a period."
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                <Card title="Inventory Distribution by Location" className="xl:col-span-3 h-96">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={inventoryDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                           <XAxis type="number" tick={{ fill: '#94a3b8' }} />
                           <YAxis type="category" dataKey="location" width={80} tick={{ fill: '#94a3b8' }} />
                           <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                labelStyle={{ color: '#f1f5f9' }}
                                cursor={{fill: '#334155'}}
                            />
                           <Bar dataKey="inventory" name="Inventory Units" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Cost Breakdown" className="xl:col-span-2 h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                             <Pie
                                data={costBreakdown}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {costBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                formatter={(value: number) => `$${value.toLocaleString()}`}
                            />
                            <Legend wrapperStyle={{color: '#f1f5f9'}} />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
