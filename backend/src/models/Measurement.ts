import mongoose, { Schema, Document } from 'mongoose';

export interface IMeasurement extends Document {
    codigo_wmo: string;
    data_hora: Date;
    precipitacao_mm: number;
    pressao_atual: number;
    pressao_max_hora: number;
    pressao_min_hora: number;
    radiacao_global: number;
    temperatura_atual: number;
    temperatura_max_hora: number;
    temperatura_min_hora: number;
    ponto_orvalho: number;
    ponto_orvalho_max: number;
    ponto_orvalho_min: number;
    umidade_atual: number;
    umidade_max_hora: number;
    umidade_min_hora: number;
    vento_direcao: number;
    vento_rajada_max: number;
    vento_velocidade: number;
}

const MeasurementSchema = new Schema<IMeasurement>({
    codigo_wmo: { type: String, required: true, ref: 'Station' },
    data_hora: { type: Date, required: true },
    precipitacao_mm: { type: Number },
    pressao_atual: { type: Number },
    pressao_max_hora: { type: Number },
    pressao_min_hora: { type: Number },
    radiacao_global: { type: Number },
    temperatura_atual: { type: Number },
    temperatura_max_hora: { type: Number },
    temperatura_min_hora: { type: Number },
    ponto_orvalho: { type: Number },
    ponto_orvalho_max: { type: Number },
    ponto_orvalho_min: { type: Number },
    umidade_atual: { type: Number },
    umidade_max_hora: { type: Number },
    umidade_min_hora: { type: Number },
    vento_direcao: { type: Number },
    vento_rajada_max: { type: Number },
    vento_velocidade: { type: Number },
}, {
    timeseries: {
        timeField: 'data_hora',
        metaField: 'codigo_wmo',
        granularity: 'hours',
    }
});

export default mongoose.model<IMeasurement>('Measurement', MeasurementSchema);