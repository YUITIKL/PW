import mongoose, { Schema, Document } from 'mongoose';

export interface ICity extends Document<number> {
    _id: number;
    cidade: string;
    uf: string;
    regiao: string;
    populacao: number;
}

const CitySchema = new Schema<ICity>({
    _id: { type: Number, required: true },
    cidade: { type: String, required: true },
    uf: { type: String, required: true },
    regiao: { type: String, required: true },
    populacao: { type: Number },
});

export default mongoose.model<ICity>('City', CitySchema);