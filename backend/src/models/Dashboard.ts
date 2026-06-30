import mongoose, { Schema, Document } from 'mongoose';

export interface ISharedWith {
    from: mongoose.Types.ObjectId;
    to: mongoose.Types.ObjectId;
}

export interface IDashboard extends Document {
    nome: string;
    descricao: string;
    metabase_dashboard_id: string;
    data_inicio?: string;
    data_fim?: string;
    cidade?: string;
    criado_por: mongoose.Types.ObjectId;
    data_criacao: Date;
    compartilhado_com: ISharedWith[];
    salvos_por: mongoose.Types.ObjectId[];
}

const SharedWithSchema = new Schema<ISharedWith>({
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const DashboardSchema = new Schema<IDashboard>({
    nome: { type: String, required: true },
    descricao: { type: String },
    metabase_dashboard_id: { type: String, required: true },
    data_inicio: { type: String, required: false },
    data_fim: { type: String, required: false },
    cidade: { type: String, required: false },
    criado_por: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    data_criacao: { type: Date, default: Date.now },
    compartilhado_com: [SharedWithSchema],
    salvos_por: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model<IDashboard>('Dashboard', DashboardSchema);