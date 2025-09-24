import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// 数据接口定义
interface SalesData {
  month: string;
  NIO: number;
  BYD: number;
  Tesla: number;
  XPeng: number;
  [key: string]: string | number;
}

interface MarketShareData {
  name: string;
  value: number;
  color: string;
}

interface GrowthData {
  quarter: string;
  growth: number;
}

interface BrandPerformanceData {
  brand: string;
  sales: number;
  marketShare: number;
  growth: number;
  color: string;
}

// 图表组件属性接口
interface ChartProps {
  data: any[];
  height?: number;
  className?: string;
}

// 销量趋势图表
export const SalesTrendChart: React.FC<ChartProps & { data: SalesData[] }> = ({ 
  data, 
  height = 300, 
  className = "" 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Monthly Sales Trend by Brand
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            stroke="#666"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#666"
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [
              `${value.toLocaleString()} units`, 
              name
            ]}
            labelStyle={{ color: '#333' }}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="BYD" 
            stroke="#FF6B6B" 
            strokeWidth={3}
            dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#FF6B6B', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="Tesla" 
            stroke="#4ECDC4" 
            strokeWidth={3}
            dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#4ECDC4', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="NIO" 
            stroke="#45B7D1" 
            strokeWidth={3}
            dot={{ fill: '#45B7D1', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#45B7D1', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="XPeng" 
            stroke="#96CEB4" 
            strokeWidth={3}
            dot={{ fill: '#96CEB4', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#96CEB4', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// 市场份额饼图
export const MarketShareChart: React.FC<ChartProps & { data: MarketShareData[] }> = ({ 
  data, 
  height = 300, 
  className = "" 
}) => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Market Share Distribution
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number, name: string) => [`${value}%`, 'Market Share']}
            labelFormatter={(label) => `Brand: ${label}`}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry: any) => (
              <span style={{ color: entry.color }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// 增长率面积图
export const GrowthChart: React.FC<ChartProps & { data: GrowthData[] }> = ({ 
  data, 
  height = 300, 
  className = "" 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Quarterly Growth Rate
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="quarter" 
            tick={{ fontSize: 12 }}
            stroke="#666"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#666"
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}%`, 'Growth Rate']}
            labelStyle={{ color: '#333' }}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
          />
          <Area
            type="monotone"
            dataKey="growth"
            stroke="#8884d8"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorGrowth)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// 品牌表现柱状图
export const BrandPerformanceChart: React.FC<ChartProps & { data: BrandPerformanceData[] }> = ({ 
  data, 
  height = 300, 
  className = "" 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Brand Performance Comparison
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="brand" 
            tick={{ fontSize: 12 }}
            stroke="#666"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#666"
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip 
            formatter={(value: number, name: string) => {
              if (name === 'sales') return [`${value.toLocaleString()} units`, 'Sales'];
              if (name === 'marketShare') return [`${value}%`, 'Market Share'];
              if (name === 'growth') return [`${value}%`, 'Growth Rate'];
              return [value, name];
            }}
            labelStyle={{ color: '#333' }}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar 
            dataKey="sales" 
            fill="#8884d8" 
            name="Sales"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 组合图表组件
export const EVMarketOverview: React.FC<{
  salesData: SalesData[];
  marketShareData: MarketShareData[];
  growthData: GrowthData[];
  brandPerformanceData: BrandPerformanceData[];
}> = ({ salesData, marketShareData, growthData, brandPerformanceData }) => {
  return (
    <div className="space-y-8">
      {/* 上半部分：销量趋势和市场份额 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesTrendChart data={salesData} />
        <MarketShareChart data={marketShareData} />
      </div>
      
      {/* 下半部分：增长率和品牌表现 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GrowthChart data={growthData} />
        <BrandPerformanceChart data={brandPerformanceData} />
      </div>
    </div>
  );
};

export default EVMarketCharts;