import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Auth, getAuth, signOut, onIdTokenChanged } from 'firebase/auth';
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
  private _idToken = new BehaviorSubject<string | null>(null);
  private firebaseAuth: Auth = getAuth();

  constructor(
    private http: HttpClient, 
    private router: Router,
    private ngZone: NgZone
  ) {
    this.autoLogin();

    onIdTokenChanged(this.firebaseAuth, firebaseUser => {
      this.ngZone.run(() => {
        if (firebaseUser) {
          firebaseUser.getIdToken().then(idToken => {
            this._idToken.next(idToken);
            
            const currentUser = this.user.getValue();
            if (currentUser && currentUser.id === firebaseUser.uid) {
              const expirationTime = new Date(new Date().getTime() + 3600 * 1000);
              const updatedUser = new User(
                currentUser.firstName,
                currentUser.lastName,
                currentUser.email,
                currentUser.username,
                currentUser.id,
                idToken,
                expirationTime
              );
              this.saveUserData(updatedUser);
            }
          }).catch(error => {
            console.error('Error getting Firebase ID token:', error);
            this._idToken.next(null);
          });
        } else {
          this._idToken.next(null);
          this.clearUserData();
        }
      });
    });
    
  }

  get isUserAuthenticated(): Observable<boolean> {
    return this._idToken.asObservable().pipe(
      map(token => !!token)
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
      this.clearUserData();
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
              this._idToken.next(user.token);
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
    return this._idToken.getValue();
  }

  getUserId(): string | null {
    return this.user.getValue()?.id || null;
  }
}
