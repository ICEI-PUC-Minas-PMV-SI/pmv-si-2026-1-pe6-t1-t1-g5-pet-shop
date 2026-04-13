import { Request, Response } from "express";
import { EmployeeService } from "./employee.service";
import { EmployeeDtoMapper } from "./dto/mappers/employee-dto.mapper";

export class EmployeeController {
  constructor(
    private readonly service: EmployeeService,
    private readonly mapper: EmployeeDtoMapper,
  ) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const employees = await this.service.listAllEmployees();
      const response = this.mapper.toObjects(employees);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const employee = await this.service.getEmployeeById(id);
      const response = this.mapper.toObject(employee);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: "Employee not found" });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const employee = await this.service.createEmployee(req.body);
      const response = this.mapper.toObject(employee);
      res.status(201).json(response);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const employee = await this.service.updateEmployee(id, req.body);
      const response = this.mapper.toObject(employee);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.deleteEmployee(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
