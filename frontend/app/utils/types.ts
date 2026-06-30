export interface IDashboard {
  _id: string;
  nome: string;
  descricao: string;
  metabase_dashboard_id: string;
  data_inicio?: string;
  data_fim?: string;
  cidade?: string;
  criado_por: IUser;
  data_criacao: Date;
  compartilhado_com: ISharedWith[];
  salvos_por: Array<IUser | string>;
}

export interface ISharedWith {
  from: IUser;
  to: IUser;
}

export interface IUser {
  _id: string;
  nome: string;
  username: string;
}

export type Pages = "national" | "city" | "shared" | "favorites";
export type DashboardMode = "national" | "city";

export type Filters = {
  city?: string;
  startDate: string;
  endDate: string;
};

