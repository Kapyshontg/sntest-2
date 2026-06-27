export interface User {
  id: string;
  username: string;
  fio: string;
  plotNumber: string;
  phone: string;
  email: string;
  plotArea: number; // in sq. meters (сотки * 100)
  balance: number; // in rubles
  isAdmin: boolean;
  meterReading: number; // current kWh
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  targetPlot?: string; // empty means public
  read?: boolean;
}

export interface SupportMessage {
  id: string;
  fio: string;
  plotNumber: string;
  phone: string;
  message: string;
  createdAt: string;
}

export interface MeterReadingRecord {
  id: string;
  plotNumber: string;
  value: number;
  date: string;
  amountBilled: number;
}

export interface VoteOption {
  id: string;
  text: string;
  votes: number;
}

export interface VotingSession {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed';
  quorumRequired: number; // e.g. 50%
  quorumCurrent: number; // current %
  options: VoteOption[];
  userVotedOptionId?: string; // filled on client if user voted
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  isImportant?: boolean;
}

export interface SntStats {
  totalPlots: number;
  totalMembers: number;
  feePerSotka: number;
  tpPower: string;
  totalDebt: number;
  totalCollectedFees: number;
  energyConsumptionHistory: {
    month: string;
    consumption: number; // kWh
    cost: number; // rubles
  }[];
  feesHistory: {
    year: string;
    required: number;
    collected: number;
  }[];
}
