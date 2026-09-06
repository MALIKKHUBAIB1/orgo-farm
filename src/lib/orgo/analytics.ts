export type VisitRecord = {
  ip: string;
  path: string;
  browser: string;
  os: string;
  device: string;
  referrer: string;
  city: string;
  country: string;
  timezone: string;
  language: string;
  took: number;
  createdAt: string;
};

export type DailyPoint = {
  date: string;
  count: number;
  unique: number;
};

export type Analytics = {
  periodDays: number;
  total: number;
  unique: number;
  daily: DailyPoint[];
  devices: { label: string; count: number }[];
  browsers: { label: string; count: number }[];
  os: { label: string; count: number }[];
  paths: { path: string; count: number }[];
  ips: { ip: string; count: number; lastSeen: string }[];
  recent: VisitRecord[];
};