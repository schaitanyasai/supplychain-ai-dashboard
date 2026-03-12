import { 
  HistoricalData, 
  ForecastData, 
  Shipment, 
  InventoryStatus, 
  SimulationDayResult, 
  KPIs,
  OptimizationResult,
  OptimizationParameters,
  SimulationParameters,
  InventoryDistributionItem,
  CostBreakdownItem,
} from '../types';
import { PRODUCTS, WAREHOUSES, STORES } from '../constants';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const generateSalesData = (days: number, seasonality: number = 7, trend: number = 0.05) => {
  const data: HistoricalData[] = [];
  for (let i = days; i > 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dayOfWeek = date.getDay();
    const seasonalFactor = (Math.sin((dayOfWeek / seasonality) * 2 * Math.PI) + 1) / 2;
    const baseSales = 100 + i * trend;
    const sales = Math.floor(baseSales * (0.8 + seasonalFactor * 0.4) + Math.random() * 20);
    data.push({ date: formatDate(date), sales });
  }
  return data;
};

const generateForecast = (historical: HistoricalData[], forecastDays: number): ForecastData[] => {
  const lastHistoricalPoint = historical[historical.length - 1];
  if (!lastHistoricalPoint) return [];

  const lastSales = lastHistoricalPoint.sales;
  const forecast: ForecastData[] = [];
  for (let i = 1; i <= forecastDays; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const predicted = lastSales * (1 + (Math.random() - 0.5) * 0.2);
    forecast.push({
      date: formatDate(date),
      predicted: Math.max(0, Math.round(predicted)),
      lowerBound: Math.max(0, Math.round(predicted * 0.8)),
      upperBound: Math.round(predicted * 1.2),
    });
  }
  return forecast;
};

export const getDemandData = async (productId: string): Promise<{ historical: HistoricalData[], forecast: ForecastData[] }> => {
  await delay(800);
  console.log(`Fetching demand data for ${productId}`);
  const historical = generateSalesData(90);
  const forecast = generateForecast(historical, 14);
  return { historical, forecast };
};

export const getInitialInventory = async (): Promise<InventoryStatus[]> => {
    await delay(500);
    const inventory: InventoryStatus[] = [];
    PRODUCTS.forEach(product => {
        WAREHOUSES.forEach(wh => {
            inventory.push({ warehouse: wh, product, onHand: Math.floor(Math.random() * 1000) + 500 });
        });
        STORES.forEach(store => {
            inventory.push({ warehouse: store, product, onHand: Math.floor(Math.random() * 200) + 50 });
        });
    });
    return inventory;
};

export const runOptimization = async (params: OptimizationParameters): Promise<OptimizationResult> => {
  await delay(2500);
  const shipments: Shipment[] = [];
  const numShipments = Math.ceil(params.horizonDays * 1.5);

  for (let i = 0; i < numShipments; i++) {
    const dispatchDate = new Date();
    dispatchDate.setDate(today.getDate() + Math.floor(Math.random() * (params.horizonDays / 2)));
    const arrivalDate = new Date(dispatchDate);
    arrivalDate.setDate(dispatchDate.getDate() + Math.floor(Math.random() * 3) + 1);

    shipments.push({
      id: `SHP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      from: WAREHOUSES[Math.floor(Math.random() * WAREHOUSES.length)],
      to: STORES[Math.floor(Math.random() * STORES.length)],
      product: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
      quantity: Math.floor(Math.random() * 100) + 20,
      dispatchDate: formatDate(dispatchDate),
      arrivalDate: formatDate(arrivalDate),
      cost: Math.floor(Math.random() * 500) + 100,
    });
  }

  const baseCost = shipments.reduce((sum, s) => sum + s.cost, 0);
  const serviceLevelImpact = params.costServiceTradeoff / 100; // 0 to 1
  
  const projectedCost = Math.round(baseCost * (1 + serviceLevelImpact * 0.15)); // Higher service level costs more
  const projectedServiceLevel = 95 + (5 * serviceLevelImpact) - (Math.random() * (1-serviceLevelImpact) * 2); // Higher priority -> higher SL

  return {
    shipments,
    projectedCost,
    projectedServiceLevel: parseFloat(projectedServiceLevel.toFixed(1)),
  };
};

export const runSimulation = async (shipments: Shipment[], params: SimulationParameters): Promise<SimulationDayResult[]> => {
  await delay(2000);
  const results: SimulationDayResult[] = [];
  let inventory = params.startingInventory;
  const simulationDays = 14;

  const volatilityMultipliers = { low: 0.1, medium: 0.3, high: 0.6 };
  const leadTimeDelay = { none: 0, low: 1, high: 3 };

  // Apply lead time variability
  const stochasticShipments = shipments.map(s => {
      const delayDays = Math.floor(Math.random() * (leadTimeDelay[params.leadTimeVariability] + 1));
      const newArrivalDate = new Date(s.arrivalDate);
      newArrivalDate.setDate(newArrivalDate.getDate() + delayDays);
      return { ...s, arrivalDate: formatDate(newArrivalDate) };
  });

  for (let i = 1; i <= simulationDays; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const dateStr = formatDate(date);
    
    const openingInventory = inventory;
    const shipmentsIn = stochasticShipments.filter(s => s.arrivalDate === dateStr).reduce((sum, s) => sum + s.quantity, 0);
    inventory += shipmentsIn;

    const baseDemand = 75;
    const volatility = (Math.random() - 0.5) * baseDemand * volatilityMultipliers[params.demandVolatility];
    const demand = Math.max(0, Math.floor(baseDemand + volatility));
    
    const sales = Math.min(inventory, demand);
    inventory -= sales;

    const closingInventory = inventory;
    const stockout = sales < demand;

    results.push({
      day: i,
      date: dateStr,
      openingInventory,
      shipmentsIn,
      demand,
      sales,
      closingInventory,
      stockout,
      dailyCost: (closingInventory * 2) + (stockout ? 500 : 0), // Holding cost + stockout cost
    });
  }
  return results;
};


export const getDashboardKpis = async (): Promise<KPIs> => {
    await delay(600);
    return {
        totalCost: 1250000,
        serviceLevel: 97.2,
        inventoryTurns: 8.5,
        costSavings: 15.3,
    };
};

export const getInventoryDistribution = async (): Promise<InventoryDistributionItem[]> => {
    await delay(700);
    const locations = [...WAREHOUSES, ...STORES];
    return locations.map(loc => ({
        location: loc.replace('-', ' '),
        inventory: Math.floor(Math.random() * 5000) + 1000,
    })).sort((a,b) => b.inventory - a.inventory);
};

export const getCostBreakdown = async (): Promise<CostBreakdownItem[]> => {
    await delay(750);
    return [
        { name: 'Transportation', value: 450000 },
        { name: 'Inventory Holding', value: 300000 },
        { name: 'Labor', value: 250000 },
        { name: 'Overhead', value: 250000 },
    ];
};
