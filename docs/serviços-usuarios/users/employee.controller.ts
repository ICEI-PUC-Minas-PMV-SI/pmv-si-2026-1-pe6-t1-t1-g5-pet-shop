import { Request, Response } from 'express';
import { EmployeeService } from './employee.service';

export class EmployeeController {
  private service = new EmployeeService();

  list = async (req: Request, res: Response) => {
    try {
      const data = await this.service.list();
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const data = await this.service.getById(id);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const data = await this.service.create(req.body);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      await this.service.delete(id);
      res.json({ success: true, message: "Funcionário deletado com sucesso" });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}