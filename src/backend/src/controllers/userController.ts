import { Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { AuthRequest } from '../middlewares/auth';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.userId).select('-senha_hash');
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
      const users = await User.find({
          _id: { $ne: req.userId },
          ativo: true
      }).select('-senha_hash');

      res.status(200).json(users);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
      const { nome, username } = req.body;

      const existingUser = await User.findOne({
          username,
          _id: { $ne: req.userId }
      });

      if (existingUser) {
          res.status(409).json({ message: 'Username já cadastrado' });
          return;
      }

      const user = await User.findByIdAndUpdate(
          req.userId,
          { nome, username },
          { new: true }
      ).select('-senha_hash');

      if (!user) {
          res.status(404).json({ message: 'Usuário não encontrado' });
          return;
      }

      res.status(200).json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias' });
            return;
        }

        const user = await User.findById(req.userId);
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }

        const senhaCorreta = await bcrypt.compare(currentPassword, user.senha_hash);
        if (!senhaCorreta) {
            res.status(401).json({ message: 'Senha atual incorreta' });
            return;
        }

        user.senha_hash = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findByIdAndUpdate(req.userId, {
          ativo: false,
          email: `deleted_${req.userId}_${Date.now()}@deleted.local`,
          username: `deleted_${req.userId}_${Date.now()}`,
        });

        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }

        res.status(200).json({ message: 'Conta desativada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};