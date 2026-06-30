import mongoose, { Schema, Document } from 'mongoose';

export interface ICity extends Document {
    codigo_ibge: number;
    cidade: string;
    uf: string;
    regiao: string;
    populacao: number;
}

const CitySchema = new Schema<ICity>({
    codigo_ibge: { type: Number, required: true, unique: true },
    cidade: { type: String, required: true },
    uf: { type: String, required: true },
    regiao: { type: String },
    populacao: { type: Number }
});

export default mongoose.model<ICity>('City', CitySchema);