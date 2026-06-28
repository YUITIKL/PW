import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nome, username, email, password } = req.body;

        if (!nome || !username || !email || !password) {
            res.status(400).json({ message: 'Todos os campos são obrigatórios' });
            return;
        }

        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            res.status(400).json({ message: 'E-mail ou username já cadastrado' });
            return;
        }

        const senha_hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            nome,
            username,
            email,
            senha_hash,
            perfil: 'usuario',
            ativo: true,
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                nome: user.nome,
                username: user.username,
                email: user.email,
                perfil: user.perfil,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ $or: [{ email }, { username: email }] });
        if (!user) {
            res.status(401).json({ message: 'E-mail ou senha inválidos' });
            return;
        }

        const senhaCorreta = await bcrypt.compare(password, user.senha_hash);
        if (!senhaCorreta) {
            res.status(401).json({ message: 'E-mail ou senha inválidos' });
            return;
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                nome: user.nome,
                username: user.username,
                email: user.email,
                perfil: user.perfil,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};