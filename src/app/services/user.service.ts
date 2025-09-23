import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  map,
  Observable,
  catchError,
  throwError,
  of,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.services';

export class UserSummary {
  constructor(
    public id: string = '',
    public firstName: string = '',
    public lastName: string = '',
    public email: string = '',
    public username: string = ''
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _users = new BehaviorSubject<UserSummary[]>([]);

  private _isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this._isLoading.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  get users(): Observable<UserSummary[]> {
    return this._users.asObservable();
  }

  getAllUsers(): Observable<UserSummary[]> {
    const token = this.authService.getCurrentUser()?.token;
    if (!token) return throwError(() => new Error('Token nije pronađen.'));

    return this.http
      .get<{ [key: string]: any }>(
        `${environment.firebaseConfig.firebaseRDBUrl}/users.json?auth=${token}`
      )
      .pipe(
        map((usersData) => {
          if (!usersData) return [];
          return Object.keys(usersData).map(
            (key) =>
              new UserSummary(
                key,
                usersData[key].firstName,
                usersData[key].lastName,
                usersData[key].email,
                usersData[key].username
              )
          );
        }),
        map((userSummaries) => {
          this._users.next(userSummaries);
          return userSummaries;
        }),
        catchError((error) => {
          console.error('Greška pri učitavanju korisnika:', error);
          return of([]);
        })
      );
  }

  get users$(): Observable<UserSummary[]> {
    return this._users.asObservable();
  }

  getMyUser(): Observable<UserSummary> {
    const currentUserId = this.authService.getUserId();
    if (!currentUserId) {
      return of(new UserSummary());
    }

    return this.users.pipe(
      map((summaries) => {
        const me = summaries.find((summary) => summary.id === currentUserId);
        return me
          ? new UserSummary(
              me.id,
              me.firstName,
              me.lastName,
              me.email,
              me.username
            )
          : new UserSummary();
      })
    );
  }
}
