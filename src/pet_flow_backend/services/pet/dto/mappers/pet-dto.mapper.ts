import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { PetResponseDto } from "../models/pet-response.dto";
import { Pet } from "../../domain/models/pet";

export class PetDtoMapper
  implements Mapper<Pet, PetResponseDto>, ReversedMapper<Pet, PetResponseDto>
{
  constructor() {}

  toObject(fromObject: Pet): PetResponseDto {
    // Usamos uma conversão temporária para 'any' para acessar o birth_date
    // que existe no banco (image_f08918.png) mas talvez não no modelo de domínio
    const petData = fromObject as unknown as Record<string, unknown>;

    return {
      id: fromObject.id || "",
      name: fromObject.name || "",
      species: fromObject.species || "",
      breed: fromObject.breed || "",
      // PRIORIDADE: Se houver birth_date (banco), calcula a idade.
      // Caso contrário, usa o age (memória/DTO).
      age: petData.birth_date
        ? this.calculateAge(petData.birth_date as Date | string)
        : fromObject.age || 0,
      weight: fromObject.weight || 0,
      tutorId: fromObject.tutorId || "",
      createdAt: fromObject.createdAt || new Date(),
      updatedAt: fromObject.updatedAt || new Date(),
    };
  }

  toReversedObject(toObject: PetResponseDto): Pet {
    const pet = new Pet(
      toObject.id,
      toObject.name,
      toObject.species,
      toObject.breed,
      toObject.age,
      toObject.weight,
      toObject.tutorId,
      toObject.createdAt,
      toObject.updatedAt,
    );

    // Mapeia o 'age' do DTO de volta para 'birth_date' para que o
    // repositório/banco encontre a coluna correta (image_f08918.png)
    if (toObject.age !== undefined) {
      const birthYear = new Date().getFullYear() - toObject.age;
      // Define a data como 1º de janeiro do ano calculado
      (pet as unknown as Record<string, unknown>).birth_date = new Date(
        birthYear,
        0,
        1,
      );
    }

    return pet;
  }

  toObjects(fromObjects: Pet[]): PetResponseDto[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: PetResponseDto[]): Pet[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }

  private calculateAge(birthDate: Date | string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
}
