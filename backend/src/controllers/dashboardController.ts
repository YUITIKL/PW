import { Response } from 'express';
import Dashboard from '../models/Dashboard';
import { AuthRequest } from '../middlewares/auth';

export const getDashboards = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const dashboards = await Dashboard.find({ criado_por: { $ne: req.userId } })
            .populate('criado_por', 'nome username')
            .populate('compartilhado_com.from', 'nome username')
            .populate('compartilhado_com.to', 'nome username');

        res.status(200).json(dashboards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const getMyDashboards = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const dashboards = await Dashboard.find({ criado_por: req.userId })
            .populate('criado_por', 'nome username')
            .populate('compartilhado_com.from', 'nome username')
            .populate('compartilhado_com.to', 'nome username');

        res.status(200).json(dashboards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const getSharedWithMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const dashboards = await Dashboard.find({ 'compartilhado_com.to': req.userId })
            .populate('criado_por', 'nome username')
            .populate('compartilhado_com.from', 'nome username')
            .populate('compartilhado_com.to', 'nome username');

        res.status(200).json(dashboards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const shareDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { userIds } = req.body;

        if (!userIds || !Array.isArray(userIds)) {
            res.status(400).json({ message: 'userIds deve ser um array de IDs' });
            return;
        }

        const newShares = userIds.map((toId: string) => ({
            from: req.userId,
            to: toId,
        }));

        const dashboard = await Dashboard.findByIdAndUpdate(
            id,
            { $addToSet: { compartilhado_com: { $each: newShares } } },
            { new: true }
        );

        if (!dashboard) {
            res.status(404).json({ message: 'Dashboard não encontrado' });
            return;
        }

        res.status(200).json({ message: 'Dashboard compartilhado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const unshareDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { userIds } = req.body;

        if (!userIds || !Array.isArray(userIds)) {
            res.status(400).json({ message: 'userIds deve ser um array de IDs' });
            return;
        }

        const dashboard = await Dashboard.findByIdAndUpdate(
            id,
            { $pull: { compartilhado_com: { from: req.userId, to: { $in: userIds } } } },
            { new: true }
        );

        if (!dashboard) {
            res.status(404).json({ message: 'Dashboard não encontrado' });
            return;
        }

        res.status(200).json({ message: 'Compartilhamentos removidos com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const deleteDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const dashboard = await Dashboard.findOneAndDelete({ _id: id, criado_por: req.userId });

        if (!dashboard) {
            res.status(404).json({ message: 'Dashboard não encontrado ou sem permissão' });
            return;
        }

        res.status(200).json({ message: 'Dashboard removido com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const createDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { nome, descricao, metabase_dashboard_id, data_inicio, data_fim, cidade } = req.body;

        if (!nome || !metabase_dashboard_id) {
            res.status(400).json({ message: 'Nome e ID do Metabase são obrigatórios' });
            return;
        }

        const dashboard = await Dashboard.create({
            nome,
            descricao,
            metabase_dashboard_id,
            data_inicio,
            data_fim,
            cidade,
            criado_por: req.userId,
        });

        res.status(201).json(dashboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const updateDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { nome, descricao } = req.body;

        const dashboard = await Dashboard.findOneAndUpdate(
            { _id: id, criado_por: req.userId },
            { nome, descricao },
            { new: true }
        );

        if (!dashboard) {
            res.status(404).json({ message: 'Dashboard não encontrado ou sem permissão' });
            return;
        }

        res.status(200).json(dashboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const favoriteDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const dashboard = await Dashboard.findByIdAndUpdate(
            id,
            { $addToSet: { salvos_por: req.userId } },
            { new: true }
        );

        if (!dashboard) {
            res.status(404).json({ message: 'Dashboard não encontrado' });
            return;
        }

        res.status(200).json({ message: 'Dashboard favoritado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const unfavoriteDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const dashboard = await Dashboard.findByIdAndUpdate(
            id,
            { $pull: { salvos_por: req.userId } },
            { new: true }
        );

        if (!dashboard) {
            res.status(404).json({ message: 'Dashboard não encontrado' });
            return;
        }

        res.status(200).json({ message: 'Dashboard removido dos favoritos' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const getDashboardShares = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const dashboard = await Dashboard.findById(id)
            .populate('compartilhado_com.from', 'nome username')
            .populate('compartilhado_com.to', 'nome username');

        if (!dashboard) {
            res.status(404).json({ message: 'Dashboard não encontrado' });
            return;
        }

        res.status(200).json(dashboard.compartilhado_com);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const getSavedDashboards = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const dashboards = await Dashboard.find({ salvos_por: req.userId })
            .populate('criado_por', 'nome username')
            .populate('compartilhado_com.from', 'nome username')
            .populate('compartilhado_com.to', 'nome username');

        res.status(200).json(dashboards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};