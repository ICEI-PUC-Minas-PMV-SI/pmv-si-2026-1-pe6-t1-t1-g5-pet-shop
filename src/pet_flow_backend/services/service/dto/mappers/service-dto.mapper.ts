import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { ServiceResponseDto } from "../models/service-response.dto";
import { Service } from "../../domain/models/service";

export class ServiceDtoMapper
  implements
    Mapper<Service, ServiceResponseDto>,
    ReversedMapper<Service, ServiceResponseDto>
{
  constructor() {}

  toObject(fromObject: Service): ServiceResponseDto {
    return {
      id: fromObject.id || "",
      name: fromObject.name || "",
      description: fromObject.description || "",
      price: fromObject.price || 0,
      duration: fromObject.duration || 0,
      createdAt: fromObject.createdAt || new Date(),
      updatedAt: fromObject.updatedAt || new Date(),
    };
  }

  toReversedObject(toObject: ServiceResponseDto): Service {
    return new Service(
      toObject.id,
      toObject.name,
      toObject.description,
      toObject.price,
      toObject.duration,
      toObject.createdAt,
      toObject.updatedAt,
    );
  }

  toObjects(fromObjects: Service[]): ServiceResponseDto[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: ServiceResponseDto[]): Service[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
