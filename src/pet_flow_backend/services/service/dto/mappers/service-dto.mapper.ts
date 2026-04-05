import { Mapper } from "../../../../shared/utils/mapper";
import { Service } from "../../domain/models/service";
import { ServiceResponseDto } from "../models/service-response.dto";

export class ServiceDtoMapper implements Mapper<Service, ServiceResponseDto> {
  toObject(model: Service): ServiceResponseDto {
    return {
      id: model.id!,
      name: model.name!,
      description: model.description!,
      price: model.price!,
      duration: model.duration!,
    };
  }

  toObjects(models: Service[]): ServiceResponseDto[] {
    return models.map((m) => this.toObject(m));
  }
}