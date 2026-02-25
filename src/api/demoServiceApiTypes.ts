interface IDemoServiceApi {
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User>;
  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
  deleteUser(id: string): Promise<void>;
  
  getCharts(): Promise<Chart[]>;
  getChart(id: string): Promise<Chart>;
  createChart(chart: Chart): Promise<Chart>;
  updateChart(chart: Chart): Promise<Chart>;
  deleteChart(id: string): Promise<void>;
}

type Chart = {
  id: string;
  createdAt?: string;
  title?: string;
  description?: string;
  type: "line" | "bar" | "pie" | "scatter";
  data: ChartDataPoint[];
  pieChartConfig?: {
    showLabels?: boolean;
    showTooltip?: boolean;
    showLegend?: boolean;
    legendDirection?: "vertical" | "horizontal";
    legendPosition?: {
      vertical?: "top" | "middle" | "bottom";
      horizontal?: "center" | "end" | "start";
    };
    innerRadius?: number;
    outerRadius?: number;
    paddingAngle?: number;
    cornerRadius?: number;
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  };
  lineChartConfig?: {
    showTooltip?: boolean;
    showLegend?: boolean;
    legendDirection?: "vertical" | "horizontal";
    legendPosition?: {
      vertical?: "top" | "middle" | "bottom";
      horizontal?: "center" | "end" | "start";
    };
    showGrid?: boolean;
    xAxisLabel?: string;
    yAxisLabel?: string;
    xAxisType?: "linear" | "point" | "band" | "time" | "utc" | "log";
    yAxisType?: "linear" | "point" | "band" | "time" | "utc" | "log";
    curve?: "linear" | "monotoneX" | "monotoneY" | "step" | "stepBefore" | "stepAfter";
    area?: boolean;
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  };
  scatterChartConfig?: {
    showGrid?: boolean;
    showLegend?: boolean;
    legendDirection?: "vertical" | "horizontal";
    legendPosition?: {
      vertical?: "top" | "middle" | "bottom";
      horizontal?: "center" | "end" | "start";
    };
    showTooltip?: boolean;
    xAxisLabel?: string;
    yAxisLabel?: string;
    xAxisType?: "linear" | "point" | "band" | "time" | "utc" | "log";
    yAxisType?: "linear" | "point" | "band" | "time" | "utc" | "log";
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  };
  barChartConfig?: {
    showGrid?: boolean;
    showLegend?: boolean;
    legendDirection?: "vertical" | "horizontal";
    legendPosition?: {
      vertical?: "top" | "middle" | "bottom";
      horizontal?: "center" | "end" | "start";
    };
    showTooltip?: boolean;
    xAxisLabel?: string;
    yAxisLabel?: string;
    yAxisType?: "linear" | "point" | "band" | "time" | "utc" | "log";
    layout?: "vertical" | "horizontal";
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  };
}

type ChartDataPoint = {
  id: string | number;
  label: string;
  value: number;
  color?: string;
}

type User = {
  id: string;
  createdAt?: string;
  name: string;
  avatarUrl?: string;
  email: string;
  active: boolean;
  address: {
    street?: string,
    city?: string,
    state?: string,
    zip?: string,
    country: string
  }
}

type ZipCodeInfo = {
  postalCode: string;
  state: string;
  placeName: string;
  latitude: string;
  longitude: string;
}

export { IDemoServiceApi, User, Chart, ChartDataPoint, ZipCodeInfo };