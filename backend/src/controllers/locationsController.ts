import { Request, Response } from "express";

export const getStates = async (_req: Request, res: Response): Promise<void> => {
  try {
    const response = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
    );

    const data = await response.json();

    const states = data.map((state: any) => ({
      id: state.id,
      nome: state.nome,
      sigla: state.sigla,
    }));

    res.status(200).json(states);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar estados" });
  }
};

export const getCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uf } = req.params;

    if (!uf) {
      res.status(400).json({ message: "UF é obrigatória" });
      return;
    }

    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`
    );

    const data = await response.json();

    const cities = data.map((city: any) => ({
      id: city.id,
      nome: city.nome,
      estado: uf,
    }));

    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar cidades" });
  }
};
