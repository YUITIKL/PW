export type DashboardProps = {
  sharedBy?: User[];
  sharedWith?: User[];
  saved: boolean;
};

export type User = {
  id: number;
  name: string;
};

// TODO remove
export const mockedUsers: User[] = [
  { id: 0, name: "Alisson Becker" },
  { id: 1, name: "Danilo Luiz" },
  { id: 2, name: "Gabriel Magalhães" },
  { id: 3, name: "Léo Pereira" },
  { id: 4, name: "Douglas Santos" },
  { id: 5, name: "Bruno Guimarães" },
  { id: 6, name: "Lucas Paquetá" },
  { id: 7, name: "Neymar Júnior" },
  { id: 8, name: "Vinícius Júnior" },
  { id: 9, name: "Endrick Felipe" },
];
