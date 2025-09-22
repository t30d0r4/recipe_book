import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { tap } from 'rxjs';
import { User } from '../models/user.model';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isUserAuthenticated = false;
  user: User | null | undefined;

  constructor(private http: HttpClient) {}

  get isUserAuthenticated(): boolean {
    return this._isUserAuthenticated;
  }

  register(user: UserData) {
    console.log(user.email);
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseConfig.apiKey}`,
        { email: user.email, password: user.password, returnSecureToken: true }
      )
      .pipe(
        tap((userData) => {
          const expirationTime = new Date(
            new Date().getTime() + +userData.expiresIn * 1000
          );
          const newUser = new User(
            user.firstName,
            user.lastName,
            user.email,
            user.username,
            userData.localId,
            userData.idToken,
            expirationTime
          );

          this.user = newUser;
          this._isUserAuthenticated = true;

          this.addUserToDatabase(newUser);
        })
      );
  }

  private addUserToDatabase(user: User) {
    console.log(user.token);
    const userRef = `${environment.firebaseConfig.firebaseRDBUrl}/users/${user.id}.json?auth=${user.token}`;
    return this.http.put(userRef, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    });
  }

  logIn(credentials: { email: string; password: string }) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseConfig.apiKey}`,
        {
          email: credentials.email,
          password: credentials.password,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap((userData) => {
          const expirationTime = new Date(
            new Date().getTime() + +userData.expiresIn * 1000
          );
          const user = new User(
            '',
            '',
            userData.email,
            '',
            userData.localId,
            userData.idToken,
            expirationTime
          );

          this.user = user;
          this._isUserAuthenticated = true;
        })
      );
  }

  logOut() {
    this._isUserAuthenticated = false;
    this.user = null;
  }

  getToken() {
    if (this.user) return this.user.token;
    else return null;
  }

  getUserId() {
    if (this.user) return this.user.id;
    else return null;
  }
}
