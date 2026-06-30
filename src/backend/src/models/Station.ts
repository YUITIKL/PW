import mongoose, { Schema, Document } from 'mongoose';

export interface IStation extends Document<string> {
    _id: string;
    nome: string;
    uf: string;
    regiao: string;
    latitude: number;
    longitude: number;
    altitude: number;
    data_fundacao: Date;
    status: string;
}

const StationSchema = new Schema<IStation>({
    _id: { type: String, required: true },
    nome: { type: String, required: true },
    uf: { type: String, required: true },
    regiao: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    altitude: { type: Number, required: true },
    data_fundacao: { type: Date },
    status: { type: String, required: true },
});

export default mongoose.model<IStation>('Station', StationSchema);