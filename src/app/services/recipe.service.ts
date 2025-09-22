import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, switchMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.services';
import { Recipe } from '../models/recipe.model';

interface RecipeData {
  title: string;
  description: string;
  author: string;
  difficulty: number;
  ingredients: string[];
  totalTime: number;
  servings: number;
}

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private _recipes = new BehaviorSubject<Recipe[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {}

  get recipes() {
    return this._recipes.asObservable();
  }

  addRecipe(recipe: Recipe) {
    let generatedId: string;
    return this.http
      .post<{ name: string }>(
        `${
          environment.firebaseConfig.firebaseRDBUrl
        }/recipes.json?auth=${this.authService.getToken()}`,
        { ...recipe }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this._recipes;
        }),
        take(1),
        tap((recipes) => {
          recipe.id = generatedId;
          this._recipes.next(recipes.concat(recipe));
        })
      );
  }

  getRecipes() {
    return this.http
      .get<{ [key: string]: RecipeData }>(
        `${
          environment.firebaseConfig.firebaseRDBUrl
        }/recipes.json?auth=${this.authService.getToken()}`
      )
      .pipe(
        map((recipesData) => {
          const recipes: Recipe[] = [];
          for (const key in recipesData) {
            if (recipesData.hasOwnProperty(key)) {
              recipes.push({
                id: key,
                title: recipesData[key].title,
                description: recipesData[key].description,
                author: recipesData[key].author,
                difficulty: recipesData[key].difficulty,
                ingredients: recipesData[key].ingredients,
                totalTime: recipesData[key].totalTime,
                servings: recipesData[key].servings,
              });
            }
          }
          return recipes;
        }),
        tap((recipes) => {
          this._recipes.next(recipes);
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
  getMyRecipes() {
    const currentUserId = this.authService.getUserId();
    if (!currentUserId) {
      return this._recipes.asObservable().pipe(map(() => []));
    }

    return this.recipes.pipe(
      map((recipes) =>
        recipes.filter((recipe) => recipe.author === currentUserId)
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
        tap((recipes) => {
          this._recipes.next(recipes.filter((r) => r.id !== recipeId));
        })
      );
  }
}
