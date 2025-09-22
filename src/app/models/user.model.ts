export class User {
  constructor(
    public firstName: string = '',
    public lastName: string = '',
    public email: string = '',
    public username: string = '',
    public id: string = '',
    private _token: string = '',
    private tokenExpirationDate: Date | null = null
  ) {}
  get token() {
    if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
      return null;
    }
    return this._token;
  }
}
