import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Card from '../components/Card';
import { runSimulation } from '../services/mockApiService';
import { SimulationDayResult, Shipment, SimulationParameters } from '../types';
import { LoadingSpinner, PlayIcon } from '../components/icons';

// In a real app, this would come from the optimization page
const mockShipments: Shipment[] = Array.from({ length: 5 }).map((_, i) => ({
    id: `sim-shp-${i}`,
    from: 'WH-Central',
    to: 'Store-001',
    product: 'Product A',
    quantity: Math.floor(Math.random() * 50) + 100,
    dispatchDate: new Date().toISOString().split('T')[0],
    arrivalDate: new Date(new Date().setDate(new Date().getDate() + (i * 3 + 2))).toISOString().split('T')[0],
    cost: 0,
}));


const Simulation: React.FC = () => {
    const [results, setResults] = useState<SimulationDayResult[]>([]);
    const [running, setRunning] = useState(false);
    const [params, setParams] = useState<SimulationParameters>({
        demandVolatility: 'medium',
        leadTimeVariability: 'low',
        startingInventory: 500,
    });

    const handleRunSimulation = async () => {
        setRunning(true);
        setResults([]);
        const simResults = await runSimulation(mockShipments, params);
        setResults(simResults);
        setRunning(false);
    };

    const handleParamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setParams(prev => ({ 
            ...prev, 
            [name]: name === 'startingInventory' ? parseInt(value, 10) : value 
        }));
    };

    return (
        <div className="flex flex-col gap-6">
            <Card title="Simulation Controls">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="startingInventory" className="block mb-2 text-sm font-medium text-gray-300">Starting Inventory</label>
                            <input
                                type="number"
                                id="startingInventory"
                                name="startingInventory"
                                value={params.startingInventory}
                                onChange={handleParamChange}
                                className="bg-dark-300 border border-dark-300 text-dark-content text-sm rounded-lg focus:ring-brand-secondary focus:border-brand-secondary block w-full p-2.5"
                            />
                        </div>
                         <div>
                            <label htmlFor="demandVolatility" className="block mb-2 text-sm font-medium text-gray-300">Demand Volatility</label>
                            <select
                                id="demandVolatility"
                                name="demandVolatility"
                                value={params.demandVolatility}
                                onChange={handleParamChange}
                                className="bg-dark-300 border border-dark-300 text-dark-content text-sm rounded-lg focus:ring-brand-secondary focus:border-brand-secondary block w-full p-2.5"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="leadTimeVariability" className="block mb-2 text-sm font-medium text-gray-300">Lead Time Variability</label>
                            <select
                                id="leadTimeVariability"
                                name="leadTimeVariability"
                                value={params.leadTimeVariability}
                                onChange={handleParamChange}
                                className="bg-dark-300 border border-dark-300 text-dark-content text-sm rounded-lg focus:ring-brand-secondary focus:border-brand-secondary block w-full p-2.5"
                            >
                                <option value="none">None</option>
                                <option value="low">Low</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleRunSimulation}
                        disabled={running}
                        className="bg-brand-secondary hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-fit"
                    >
                        {running ? (
                            <>
                                <LoadingSpinner className="w-5 h-5 mr-2" />
                                Simulating...
                            </>
                        ) : (
                            <>
                                <PlayIcon className="w-5 h-5 mr-2" />
                                Run 14-Day Simulation
                            </>
                        )}
                    </button>
                </div>
            </Card>

            {running && (
                <Card className="flex flex-col items-center justify-center h-96">
                    <LoadingSpinner className="w-12 h-12 text-brand-secondary" />
                    <p className="mt-4 text-gray-300">Simulating daily stochastic demand and operations...</p>
                </Card>
            )}

            {!running && results.length === 0 && (
                <Card className="flex items-center justify-center h-96 text-gray-400">
                    <p>Configure parameters and run simulation to see results.</p>
                </Card>
            )}

            {results.length > 0 && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <Card title="Inventory & Sales Over Time" className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={results} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} tick={{ fill: '#94a3b8' }} />
                                <YAxis yAxisId="left" tick={{ fill: '#94a3b8' }} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="closingInventory" name="Inventory" stroke="#8884d8" />
                                <Line yAxisId="right" type="monotone" dataKey="sales" name="Sales" stroke="#82ca9d" />
                                <Line yAxisId="right" type="monotone" dataKey="demand" name="Demand" stroke="#ffc658" strokeDasharray="3 3" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                    <Card title="Daily Shipments & Stockouts" className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={results} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} tick={{ fill: '#94a3b8' }} />
                                <YAxis tick={{ fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                <Legend />
                                <Bar dataKey="shipmentsIn" name="Shipments In" stackId="a" fill="#3b82f6" />
                                 <Bar dataKey={(data) => data.stockout ? data.demand - data.sales : 0} name="Stockouts (Lost Sales)" stackId="a" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                    <Card className="xl:col-span-2" title="Simulation Log">
                        <div className="h-64 overflow-y-auto">
                            <table className="w-full text-sm text-left text-gray-300">
                                <thead className="text-xs text-gray-400 uppercase bg-dark-300 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2">Day</th>
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2 text-right">Inv. (Open)</th>
                                        <th className="px-4 py-2 text-right">Shipments In</th>
                                        <th className="px-4 py-2 text-right">Demand</th>
                                        <th className="px-4 py-2 text-right">Sales</th>
                                        <th className="px-4 py-2 text-right">Inv. (Close)</th>
                                        <th className="px-4 py-2 text-center">Stockout</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map(r => (
                                        <tr key={r.day} className="border-b border-dark-300 hover:bg-dark-300">
                                            <td className="px-4 py-2 font-bold">{r.day}</td>
                                            <td className="px-4 py-2">{r.date}</td>
                                            <td className="px-4 py-2 text-right font-mono">{r.openingInventory}</td>
                                            <td className="px-4 py-2 text-right font-mono text-green-400">{r.shipmentsIn}</td>
                                            <td className="px-4 py-2 text-right font-mono">{r.demand}</td>
                                            <td className="px-4 py-2 text-right font-mono">{r.sales}</td>
                                            <td className="px-4 py-2 text-right font-mono">{r.closingInventory}</td>
                                            <td className="px-4 py-2 text-center">{r.stockout ? <span className="text-red-400 font-bold">YES</span> : 'No'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Simulation;