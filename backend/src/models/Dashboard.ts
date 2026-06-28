import mongoose, { Schema, Document } from 'mongoose';

export interface IDashboard extends Document {
    nome: string;
    descricao: string;
    metabase_dashboard_id: number;
    criado_por: mongoose.Types.ObjectId;
    data_criacao: Date;
    compartilhado_com: mongoose.Types.ObjectId[];
    salvos_por: mongoose.Types.ObjectId[];
}

const DashboardSchema = new Schema<IDashboard>({
    nome: { type: String, required: true },
    descricao: { type: String },
    metabase_dashboard_id: { type: Number, required: true },
    criado_por: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    data_criacao: { type: Date, default: Date.now },
    compartilhado_com: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    salvos_por: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model<IDashboard>('Dashboard', DashboardSchema);