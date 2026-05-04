export class AuthEntity {
  constructor(
    public readonly userId: string,
    public readonly token: string,
    public readonly refreshToken: string,
  ) {}
}
