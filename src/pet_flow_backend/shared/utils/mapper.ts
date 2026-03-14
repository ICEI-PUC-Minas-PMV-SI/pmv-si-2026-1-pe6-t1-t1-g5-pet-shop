export interface Mapper<FromObject, ToObject> {
  toObject(fromObject: FromObject): ToObject;
  toObjects(fromObjects: FromObject[]): ToObject[];
}

export interface ReversedMapper<FromObject, ToObject> {
  toReversedObject(toObject: ToObject): FromObject;
  toReversedObjects(toObjects: ToObject[]): FromObject[];
}
