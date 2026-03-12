import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { getInitialInventory, runOptimization } from '../services/mockApiService';
import { InventoryStatus, OptimizationResult, OptimizationParameters } from '../types';
import { LoadingSpinner, OptimizeIcon } from '../components/icons';

const Optimization: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryStatus[]>([]);
    const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
    const [loadingInventory, setLoadingInventory] = useState(true);
    const [runningOptimization, setRunningOptimization] = useState(false);
    const [params, setParams] = useState<OptimizationParameters>({
        costServiceTradeoff: 50,
        horizonDays: 7,
    });

    useEffect(() => {
        const fetchInventory = async () => {
            setLoadingInventory(true);
            const data = await getInitialInventory();
            setInventory(data);
            setLoadingInventory(false);
        };
        fetchInventory();
    }, []);

    const handleRunOptimization = async () => {
        setRunningOptimization(true);
        setOptimizationResult(null);
        const result = await runOptimization(params);
        setOptimizationResult(result);
        setRunningOptimization(false);
    };

    const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: parseInt(value, 10) }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-6">
                <Card title="Optimization Controls">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="horizonDays" className="block mb-2 text-sm font-medium text-gray-300">Optimization Horizon (Days)</label>
                            <input
                                type="number"
                                id="horizonDays"
                                name="horizonDays"
                                value={params.horizonDays}
                                onChange={handleParamChange}
                                className="bg-dark-300 border border-dark-300 text-dark-content text-sm rounded-lg focus:ring-brand-secondary focus:border-brand-secondary block w-full p-2.5"
                                min="1"
                                max="30"
                            />
                        </div>

                        <div>
                             <label htmlFor="costServiceTradeoff" className="block mb-2 text-sm font-medium text-gray-300">Goal: Cost vs. Service Level</label>
                            <input
                                id="costServiceTradeoff"
                                name="costServiceTradeoff"
                                type="range"
                                min="0"
                                max="100"
                                value={params.costServiceTradeoff}
                                onChange={handleParamChange}
                                className="w-full h-2 bg-dark-300 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>Minimize Cost</span>
                                <span>Maximize Service</span>
                            </div>
                        </div>

                        <button
                            onClick={handleRunOptimization}
                            disabled={runningOptimization}
                            className="w-full bg-brand-secondary hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {runningOptimization ? (
                                <>
                                    <LoadingSpinner className="w-5 h-5 mr-2" />
                                    Optimizing...
                                </>
                            ) : (
                                <>
                                    <OptimizeIcon className="w-5 h-5 mr-2" />
                                    Run Shipment Optimization
                                </>
                            )}
                        </button>
                    </div>
                </Card>
                <Card title="Current Inventory">
                    {loadingInventory ? <LoadingSpinner /> : (
                         <div className="h-96 overflow-y-auto pr-2">
                             <table className="w-full text-sm text-left text-gray-300">
                                 <thead className="text-xs text-gray-400 uppercase bg-dark-300 sticky top-0">
                                     <tr>
                                         <th scope="col" className="px-4 py-2">Location</th>
                                         <th scope="col" className="px-4 py-2">Product</th>
                                         <th scope="col" className="px-4 py-2 text-right">On Hand</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                 {inventory.slice(0, 20).map((item, index) => ( // Show a subset
                                     <tr key={index} className="border-b border-dark-300">
                                         <td className="px-4 py-2">{item.warehouse}</td>
                                         <td className="px-4 py-2">{item.product}</td>
                                         <td className="px-4 py-2 text-right font-mono">{item.onHand}</td>
                                     </tr>
                                 ))}
                                 </tbody>
                             </table>
                         </div>
                    )}
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card title="Optimized Shipment Plan">
                    {runningOptimization && (
                        <div className="flex flex-col items-center justify-center h-96">
                            <LoadingSpinner className="w-12 h-12 text-brand-secondary" />
                            <p className="mt-4 text-gray-300">Running advanced OR optimization engine...</p>
                        </div>
                    )}
                    {optimizationResult && (
                        <>
                        <div className="flex justify-around mb-4 text-center">
                            <div>
                                <p className="text-gray-400">Projected Cost</p>
                                <p className="text-2xl font-bold">${optimizationResult.projectedCost.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Projected Service Level</p>
                                <p className="text-2xl font-bold">{optimizationResult.projectedServiceLevel}%</p>
                            </div>
                        </div>
                        <div className="overflow-auto h-[32rem]">
                            <table className="w-full text-sm text-left text-gray-300">
                                <thead className="text-xs text-gray-400 uppercase bg-dark-300 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2">From</th>
                                        <th className="px-4 py-2">To</th>
                                        <th className="px-4 py-2">Product</th>
                                        <th className="px-4 py-2 text-right">Qty</th>
                                        <th className="px-4 py-2">Arrival</th>
                                        <th className="px-4 py-2 text-right">Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {optimizationResult.shipments.map(s => (
                                        <tr key={s.id} className="border-b border-dark-300 hover:bg-dark-300">
                                            <td className="px-4 py-2">{s.from}</td>
                                            <td className="px-4 py-2">{s.to}</td>
                                            <td className="px-4 py-2">{s.product}</td>
                                            <td className="px-4 py-2 text-right font-mono">{s.quantity}</td>
                                            <td className="px-4 py-2">{s.arrivalDate}</td>
                                            <td className="px-4 py-2 text-right font-mono">${s.cost}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        </>
                    )}
                    {!runningOptimization && !optimizationResult && (
                         <div className="flex items-center justify-center h-96 text-gray-400">
                            <p>Configure parameters and run optimization.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Optimization;