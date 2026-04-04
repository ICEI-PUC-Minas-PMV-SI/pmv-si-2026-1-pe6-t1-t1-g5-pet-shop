export class AuthEntity {
    constructor(
        public readonly userId: string,
        public readonly token: string
    ) { }
}
