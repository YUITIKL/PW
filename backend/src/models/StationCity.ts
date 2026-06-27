import mongoose, { Schema, Document } from 'mongoose';

export interface IStationCity extends Document {
    codigo_wmo: string;
    codigo_ibge: number;
}

const StationCitySchema = new Schema<IStationCity>({
    codigo_wmo: { type: String, required: true, ref: 'Station' },
    codigo_ibge: { type: Number, required: true, ref: 'City' },
});

export default mongoose.model<IStationCity>('StationCity', StationCitySchema);