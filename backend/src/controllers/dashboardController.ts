    import { Response } from 'express';
    import Dashboard from '../models/Dashboard';
    import { AuthRequest } from '../middlewares/auth';

    export const getDashboards = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const dashboards = await Dashboard.find({ criado_por: { $ne: req.userId } })
                .populate('criado_por', 'nome email')
                .populate('compartilhado_com', 'nome email');

            res.status(200).json(dashboards);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    };

    export const getMyDashboards = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const dashboards = await Dashboard.find({ criado_por: req.userId })
                .populate('criado_por', 'nome email')
                .populate('compartilhado_com', 'nome email');

            res.status(200).json(dashboards);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    };

    export const getSharedWithMe = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const dashboards = await Dashboard.find({ compartilhado_com: req.userId })
                .populate('criado_por', 'nome email')
                .populate('compartilhado_com', 'nome email');

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

            const dashboard = await Dashboard.findOneAndUpdate(
                { _id: id, criado_por: req.userId },
                { $addToSet: { compartilhado_com: { $each: userIds } } },
                { new: true }
            );

            if (!dashboard) {
                res.status(404).json({ message: 'Dashboard não encontrado ou sem permissão' });
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
            const { userId } = req.body;

            if (!userId) {
                res.status(400).json({ message: 'userId é obrigatório' });
                return;
            }

            const dashboard = await Dashboard.findOneAndUpdate(
                { _id: id, criado_por: req.userId },
                { $pull: { compartilhado_com: userId } },
                { new: true }
            );

            if (!dashboard) {
                res.status(404).json({ message: 'Dashboard não encontrado ou sem permissão' });
                return;
            }

            res.status(200).json({ message: 'Compartilhamento removido com sucesso' });
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
            const { nome, descricao, metabase_dashboard_id } = req.body;

            if (!nome || !metabase_dashboard_id) {
                res.status(400).json({ message: 'Nome e ID do Metabase são obrigatórios' });
                return;
            }

            const dashboard = await Dashboard.create({
                nome,
                descricao,
                metabase_dashboard_id,
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