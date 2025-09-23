import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, switchMap, take, tap , Observable, catchError, throwError, finalize, of, forkJoin} from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.services';
import { Recipe } from '../models/recipe.model';
import { RecipeSummary } from '../models/recipe-summary.model';

interface RecipeData {
  title: string;
  description: string;
  author: string;
  difficulty: number;
  ingredients: string[];
  totalTime: number;
  servings: number;
  images: string[];
}

interface RecipeSummaryData {
  title: string;
  authorUid: string;    
  authorUsername: string;
  difficulty: number;
  totalTime: number;
}

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private _recipes = new BehaviorSubject<RecipeSummary[]>([]);
  recipes$ = this._recipes.asObservable();
  private _isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this._isLoading.asObservable();
  
  constructor(
    private http: HttpClient, 
    private authService: AuthService
  ) {}

  get recipes(): Observable<RecipeSummary[]> {
    return this._recipes.asObservable();
  }

  addRecipe(recipe: Recipe) {
    let generatedId: string;
    const currentUser = this.authService.getCurrentUser();
    const token = this.authService.getToken();

    if (!currentUser || !token) {
      return throwError(() => new Error('Korisnik nije autentifikovan ili nedostaju podaci za dodavanje recepta.'));
    }

    recipe.author = currentUser.id;
    recipe.authorUsername = currentUser.username;

    const recipeToSave = {
      title: recipe.title,
      description: recipe.description,
      author: recipe.author,
      difficulty: recipe.difficulty,
      ingredients: recipe.ingredients,
      totalTime: recipe.totalTime,
      servings: recipe.servings,
      images: recipe.images,
    };

    return this.http
      .post<{ name: string }>(
        `${
          environment.firebaseConfig.firebaseRDBUrl
        }/recipes.json?auth=${this.authService.getToken()}`,
        recipeToSave
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this._recipes;
        }),
        take(1),
        tap((recipes) => {
          recipe.id = generatedId;
          const recipeSummary: RecipeSummary = {
            id: recipe.id,
            title: recipe.title,
            author: recipe.author,
            authorUsername: recipe.authorUsername,
            difficulty: recipe.difficulty,
            totalTime: recipe.totalTime
          };
          this._recipes.next(recipes.concat(recipeSummary));
        })
      );
  }

  getRecipes(): Observable<RecipeSummary[]> {

    this._isLoading.next(true);

    return this.authService.isUserAuthenticated.pipe(
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return throwError(() => new Error('Korisnik nije prijavljen.'));
        }

        const token = this.authService.getCurrentUser()?.token;
        if (!token) {
          return throwError(() => new Error('Token nije pronađen.'));
        }
        
        return this.http.get<{ [key: string]: RecipeData }>(
          `${environment.firebaseConfig.firebaseRDBUrl}/recipes.json?auth=${token}`
        ).pipe(
          map(recipesData => {
            const recipeList: (RecipeData & { id: string })[] = [];
            for (const key in recipesData) {
              if (recipesData.hasOwnProperty(key)) {
                recipeList.push({ ...recipesData[key], id: key });
              }
            }
            return recipeList;
          }),
          switchMap(recipes => {
            if (recipes.length === 0) {
              return of([]);
            }
            const uniqueAuthorUids = [...new Set(recipes.map(r => r.author))];
            const userObservables: { [uid: string]: Observable<string> } = {};
            uniqueAuthorUids.forEach(uid => {
              userObservables[uid] = this.http.get(
                `${environment.firebaseConfig.firebaseRDBUrl}/users/${uid}/username.json?auth=${token}`,
                { responseType: 'text' }
              ).pipe(
                map(res => {
                  console.log(`  Raw response for username ${uid}:`, res);
                  // Firebase REST API za scalarne vrednosti vraća JSON-encodovan string (npr. "true", "\"MojUser\"")
                  // Treba nam JSON.parse() da ga pretvorimo u JavaScript boolean/string
                  try {
                    const parsed = JSON.parse(res);
                    if (typeof parsed === 'string' && parsed.trim().length > 0) {
                      return parsed;
                    } else {
                      return 'Unknown author';
                    }
                  } catch (e) {
                    console.warn(`  Failed to parse username for UID ${uid}:`, res, e);
                    return 'Unknown author';
                  }
                }),
                catchError(() => of('Unknown author'))
              );
            });

            const userRequests = Object.keys(userObservables).length > 0 ? forkJoin(userObservables) : of({});

            return userRequests.pipe(
              map(usernamesMap => {
                return recipes.map(recipe => ({
                  id: recipe.id,
                  title: recipe.title,
                  author: recipe.author,
                  authorUsername: (usernamesMap as { [key: string]: string })[recipe.author] || 'Unknown author',
                  difficulty: recipe.difficulty,
                  totalTime: recipe.totalTime
                }));
              })
            );
          })
        );
      }),
      tap((summaries) => {
        this._recipes.next(summaries);
      }),
      catchError(error => {
        console.error('Failed to fetch recipes:', error);
        this._isLoading.next(false); 
        return throwError(() => new Error('Neuspešno učitavanje recepata.'));
      }),
      finalize(() => {
        this._isLoading.next(false);
      })
    );
  }

  getRecipe(id: string) {
    return this.http
      .get<RecipeData>(
        `${
          environment.firebaseConfig.firebaseRDBUrl
        }/recipes/${id}.json?auth=${this.authService.getToken()}`
      )
      .pipe(
        map((resData) => {
          return {
            id,
            title: resData.title,
            description: resData.description,
            author: resData.author,
            difficulty: resData.difficulty,
            ingredients: resData.ingredients,
            totalTime: resData.totalTime,
          };
        })
      );
  }
  getMyRecipes(): Observable<RecipeSummary[]> {
    const currentUserId = this.authService.getUserId();
    if (!currentUserId) {
      return this._recipes.asObservable().pipe(map(() => []));
    }

    return this.recipes.pipe(
      map((summaries) =>
        summaries.filter((summary) => summary.author === currentUserId)
      )
    );
  }

  deleteRecipe(recipeId: string) {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    return this.http
      .delete(
        `${environment.firebaseConfig.firebaseRDBUrl}/recipes/${recipeId}.json?auth=${token}`
      )
      .pipe(
        switchMap(() => this._recipes.pipe(take(1))),
        tap((summaries) => {
          this._recipes.next(summaries.filter((r) => r.id !== recipeId));
        })
      );
  }
}
