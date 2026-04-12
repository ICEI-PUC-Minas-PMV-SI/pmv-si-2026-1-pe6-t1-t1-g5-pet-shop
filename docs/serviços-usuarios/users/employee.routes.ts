import { Router } from 'express';
import { EmployeeController } from './employee.controller';

export class EmployeeRoutes {
  public router = Router();
  private controller = new EmployeeController();

  constructor() {
    this.router.get('/', this.controller.list);
    this.router.get('/:id', this.controller.getById);
    this.router.post('/', this.controller.create);
    this.router.delete('/:id', this.controller.delete);
  }
}