import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = 'mongodb://127.0.0.1:27018/meteorologia'; 
        
        await mongoose.connect(mongoURI);
        console.log('MongoDB conectado com sucesso');
    } catch (error) {
        console.error('Erro ao conectar no MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;