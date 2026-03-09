export interface IHostel {
  _id: string;
  name: string;
  code: string;
  address?: string;
  capacity?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "GUARD";
  hostelId?: string | null;
}

export interface IItem {
  _id: string;
  itemName: string;
  hostelId: IHostel;
  unit: "KG" | "LITRE" | "PIECE" | "PACKET" | "BOX";
  totalQuantity: number;
  availableQuantity: number;
  minThreshold: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IStockLog {
  _id: string;
  itemId: {
    _id: string;
    itemName: string;
    unit: string;
  };
  hostelId: {
    _id: string;
    name: string;
    code: string;
  };
  changedBy: {
    _id: string;
    name: string;
    role: string;
  };
  action: "INCREASE" | "DECREASE";
  quantity: number;
  beforeQty: number;
  afterQty: number;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDashboardStats {
  totalHostels: number;
  totalGuards: number;
  totalItems: number;
  totalLogs: number;
  lowStock: number;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  page: number;
  pages: number;
  total: number;
  data: T[];
}

export interface IApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}