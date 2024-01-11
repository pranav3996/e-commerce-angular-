export class User {
    constructor(
      public email: string,
      public localId: string,
     private _token: string,
     private expirationDate: Date
    ) {}
    toString(): string {
      return `User { email: ${this.email}, localId: ${this.localId}, idToken: ${this._token}, expireDate: ${this.expirationDate} }`;
    }
    get token() {
      if (new Date() > this.expirationDate) {
        return null;
      }
      return this._token;
    }
  }