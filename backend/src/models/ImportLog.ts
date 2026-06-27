import mongoose, { Schema, Document } from 'mongoose';

export interface IImportLog extends Document {
    arquivo: string;
    data_importacao: Date;
    registros_lidos: number;
    registros_importados: number;
    registros_erro: number;
    usuario_importacao: string;
}

const ImportLogSchema = new Schema<IImportLog>({
    arquivo: { type: String, required: true },
    data_importacao: { type: Date, default: Date.now },
    registros_lidos: { type: Number, required: true },
    registros_importados: { type: Number, required: true },
    registros_erro: { type: Number, required: true },
    usuario_importacao: { type: String, required: true },
});

export default mongoose.model<IImportLog>('ImportLog', ImportLogSchema);