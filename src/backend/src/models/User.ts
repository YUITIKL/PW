import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    nome: string;
    username: string;
    email: string;
    senha_hash: string;
    perfil: string;
    ativo: boolean;
    data_cadastro: Date;
}

const UserSchema = new Schema<IUser>({
    nome: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    senha_hash: { type: String, required: true },
    perfil: { type: String, required: true },
    ativo: { type: Boolean, default: true },
    data_cadastro: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);