import { Request, Response } from "express";
import { PetService } from "./pet.service";
import { PetDtoMapper } from "./dto/mappers/pet-dto.mapper";

export class PetController {
  constructor(
    private readonly service: PetService,
    private readonly mapper: PetDtoMapper,
  ) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const pets = await this.service.listAllPets();
      const response = this.mapper.toObjects(pets);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const pet = await this.service.getPetById(id);
      const response = this.mapper.toObject(pet);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: "Pet not found" });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const pet = await this.service.createPet(req.body);
      const response = this.mapper.toObject(pet);
      res.status(201).json(response);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const pet = await this.service.updatePet(id, req.body);
      const response = this.mapper.toObject(pet);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.service.deletePet(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
