export enum Page {
  Dashboard = 'Dashboard',
  DemandForecast = 'Demand Forecast',
  Optimization = 'Optimization',
  Simulation = 'Simulation',
}

export interface HistoricalData {
  date: string;
  sales: number;
}

export interface ForecastData {
  date: string;
  predicted: number;
  lowerBound: number;
  upperBound: number;
}

export interface Shipment {
  id: string;
  from: string;
  to: string;
  product: string;
  quantity: number;
  dispatchDate: string;
  arrivalDate: string;
  cost: number;
}

export interface InventoryStatus {
  warehouse: string;
  product: string;
  onHand: number;
}

export interface SimulationDayResult {
  day: number;
  date: string;
  openingInventory: number;
  shipmentsIn: number;
  demand: number;
  sales: number;
  closingInventory: number;
  stockout: boolean;
  dailyCost: number;
}

export interface KPIs {
  totalCost: number;
  serviceLevel: number;
  inventoryTurns: number;
  costSavings: number;
}

export interface OptimizationParameters {
  costServiceTradeoff: number; // 0-100, 0=cost, 100=service
  horizonDays: number;
}

export interface OptimizationResult {
  shipments: Shipment[];
  projectedCost: number;
  projectedServiceLevel: number;
}

export interface SimulationParameters {
    demandVolatility: 'low' | 'medium' | 'high';
    leadTimeVariability: 'none' | 'low' | 'high';
    startingInventory: number;
}

export interface InventoryDistributionItem {
  location: string;
  inventory: number;
}

export interface CostBreakdownItem {
  name: string;
  value: number;
}
