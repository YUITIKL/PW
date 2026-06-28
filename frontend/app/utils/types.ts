export interface IDashboard {
  nome: string;
  descricao: string;
  metabase_dashboard_id: number;
  criado_por: IUser;
  data_criacao: Date;
  compartilhado_com: ISharedWith[];
  salvos_por: IUser[];
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

