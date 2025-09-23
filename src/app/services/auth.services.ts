import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getAuth, signOut } from 'firebase/auth';
import { BehaviorSubject, Observable, throwError, catchError, switchMap, map} from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

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
  private user = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient, 
    private router: Router
  ) {
    this.autoLogin();
  }

  get isUserAuthenticated(): Observable<boolean> {
    return this.user.asObservable().pipe(
      map(user => !!user)
    );
  }

  getCurrentUser(): User | null {
    return this.user.getValue();
  }

  private saveUserData(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.user.next(user);
  }

  private clearUserData(): void {
    localStorage.clear();
    localStorage.removeItem('user');
    this.user.next(null);
  }

  private autoLogin(): void {
    const userData = localStorage.getItem('user');
    if (!userData) {
      return;
    }
    const user: User = JSON.parse(userData);

    if (user.tokenExpirationDate != null && new Date() > user.tokenExpirationDate) {
      this.logOut();
      return;
    }
    this.user.next(user);
  }

  register(userDataInput: UserData): Observable<User> {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseConfig.apiKey}`,
        { email: userDataInput.email, password: userDataInput.password, returnSecureToken: true }
      ).pipe(
        switchMap((authResponseData) => {
          const expirationTime = new Date(
            new Date().getTime() + +authResponseData.expiresIn * 1000
          );
          const newUser = new User(
            userDataInput.firstName,
            userDataInput.lastName,
            userDataInput.email,
            userDataInput.username,
            authResponseData.localId,
            authResponseData.idToken,
            expirationTime
          );

          this.saveUserData(newUser);

          return this.addUserToDatabase(newUser).pipe(
            map(() => newUser), 
            catchError(dbError => {
              console.error('Error, user can not be saved to database:', dbError);
              this.logOut();
              return throwError(() => new Error('Registration successful, error during profile saving.'));
            })
          );
        }),
        catchError(authError => {
          console.error('Error, cant register user:', authError);
          return throwError(() => new Error('Registration failed.'));
        })
      );
    } 

  private addUserToDatabase(user: User) : Observable<any>{
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
        switchMap(authResponseData => {
          const expirationTime = new Date(new Date().getTime() + +authResponseData.expiresIn * 1000);
          return this.fetchUserDataFromDatabase(authResponseData.localId, authResponseData.idToken).pipe(
            map(dbUser => {
              const user = new User(
                dbUser.firstName,
                dbUser.lastName,
                authResponseData.email,
                dbUser.username,
                authResponseData.localId,
                authResponseData.idToken,
                expirationTime
              );
              this.saveUserData(user);
              return user;
            })
          );
        }),
        catchError(authError => {
          console.error('Error, failed to login:', authError);
          return throwError(() => new Error('Failed to login'));
        })
      );
  }

  async logOut() {
    this.clearUserData();
    this.router.navigate(['/login']);
  }

  private fetchUserDataFromDatabase(userId: string, token: string): Observable<any> {
    return this.http.get(`${environment.firebaseConfig.firebaseRDBUrl}/users/${userId}.json?auth=${token}`);
  }

  getToken(): string | null {
    const user = this.user.getValue();
    return user ? user.token : null;
  }

  getUserId(): string | null {
    const user = this.user.getValue();
    return user ? user.id : null;
  }
}
