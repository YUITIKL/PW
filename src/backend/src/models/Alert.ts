import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
    codigo_wmo: string;
    data_hora: Date;
    tipo_alerta: string;
    nivel: string;
    valor: number;
    descricao: string;
}

const AlertSchema = new Schema<IAlert>({
    codigo_wmo: { type: String, required: true, ref: 'Station' },
    data_hora: { type: Date, required: true },
    tipo_alerta: { type: String, required: true },
    nivel: { type: String, required: true },
    valor: { type: Number, required: true },
    descricao: { type: String },
});

export default mongoose.model<IAlert>('Alert', AlertSchema);