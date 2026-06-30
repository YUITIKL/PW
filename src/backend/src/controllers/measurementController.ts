import { Request, Response } from 'express';
import Measurement from '../models/Measurement';
import City from '../models/City';
import StationCity from '../models/StationCity';

export const getFilteredMeasurements = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cidade, dataInicio, dataFim } = req.query;
        const query: any = {};

        if (cidade) {
            const matchedCities = await City.find({
                cidade: { $regex: String(cidade), $options: 'i' }
            });

            if (matchedCities.length === 0) {
                res.status(200).json([]);
                return;
            }

            const ibgeCodes = matchedCities.map(c => c.codigo_ibge);
            const stations = await StationCity.find({ codigo_ibge: { $in: ibgeCodes } });
            const wmoCodes = stations.map(s => s.codigo_wmo);

            query['codigo_wmo'] = { $in: wmoCodes };
        }

        if (dataInicio || dataFim) {
            query['data_hora'] = {};
            if (dataInicio) {
                query['data_hora'].$gte = new Date(String(dataInicio));
            }
            if (dataFim) {
                query['data_hora'].$lte = new Date(String(dataFim));
            }
        }

        const data = await Measurement.find(query)
            .sort({ data_hora: 1 })
            .limit(1000);

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};