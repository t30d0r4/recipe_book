import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Recipe } from '../models/recipe.model';
import { RecipesService } from '../services/recipe.service';

@Injectable({ providedIn: 'root' })
export class RecipeResolver implements Resolve<Recipe> {
  constructor(private recipesService: RecipesService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Recipe> {
    const id = route.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/recipes']);
      return EMPTY;
    }

    return this.recipesService.getRecipe(id).pipe(
      catchError(() => {
        this.router.navigate(['/recipes']);
        return EMPTY;
      })
    );
  }
}
