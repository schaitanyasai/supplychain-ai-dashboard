import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Card from '../components/Card';
import { getDemandData } from '../services/mockApiService';
import { HistoricalData, ForecastData } from '../types';
import { PRODUCTS } from '../constants';
import { LoadingSpinner } from '../components/icons';

const DemandForecast: React.FC = () => {
  const [historical, setHistorical] = useState<HistoricalData[]>([]);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<string>(PRODUCTS[0]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { historical, forecast } = await getDemandData(selectedProduct);
      setHistorical(historical);
      setForecast(forecast);
      setLoading(false);
    };
    fetchData();
  }, [selectedProduct]);

  const chartData = useMemo(() => {
    return [
      ...historical.map(h => ({ date: h.date, sales: h.sales, forecast: null, range: null })),
      ...forecast.map(f => ({ date: f.date, sales: null, forecast: f.predicted, range: [f.lowerBound, f.upperBound] })),
    ];
  }, [historical, forecast]);

  return (
    <div className="flex flex-col gap-6">
        <Card>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-dark-content">Product Demand Forecast</h2>
                <select 
                    value={selectedProduct} 
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="bg-dark-300 border border-dark-300 text-dark-content text-sm rounded-lg focus:ring-brand-secondary focus:border-brand-secondary p-2.5"
                >
                    {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
        </Card>
        <Card className="h-[60vh]">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <LoadingSpinner className="w-12 h-12 text-brand-secondary" />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" tick={{ fill: '#94a3b8' }} tickFormatter={(tick) => tick.substring(5)} />
                        <YAxis tick={{ fill: '#94a3b8' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                            labelStyle={{ color: '#f1f5f9' }}
                        />
                        <Legend wrapperStyle={{ color: '#f1f5f9' }} />
                        <Area type="monotone" dataKey="sales" name="Historical Sales" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                        <Area type="monotone" dataKey="forecast" name="Forecasted Demand" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                         <Area 
                            type="monotone" 
                            dataKey="range"
                            // FIX: The 'stroke' prop for the Area component expects a string (color value), not a boolean. Changed to "none" to disable the stroke.
                            stroke="none" 
                            fill="#a78bfa"
                            fillOpacity={0.1}
                            name="Confidence Interval"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </Card>
    </div>
  );
};

export default DemandForecast;
