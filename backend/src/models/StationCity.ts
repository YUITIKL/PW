import mongoose, { Schema, Document } from 'mongoose';

export interface IStationCity extends Document {
    codigo_wmo: string;
    codigo_ibge: number;
}

const StationCitySchema = new Schema<IStationCity>({
    codigo_wmo: { type: String, required: true },
    codigo_ibge: { type: Number, required: true }
});

export default mongoose.model<IStationCity>('StationCity', StationCitySchema);