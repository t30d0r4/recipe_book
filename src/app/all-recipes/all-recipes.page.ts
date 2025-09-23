import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { RecipesService } from '../services/recipe.service';
import { RefresherCustomEvent } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-all-recipes',
  templateUrl: './all-recipes.page.html',
  styleUrls: ['./all-recipes.page.scss'],
  standalone: false,
})
export class AllRecipesPage implements OnInit {
  isLoading$: Observable<boolean>;
  recipes$: Observable<Recipe[]>;

  constructor(private recipesService: RecipesService) {
    this.isLoading$ = this.recipesService.isLoading$;
    this.recipes$ = this.recipesService.recipes$;
  }

  ngOnInit() {
    this.recipesService.getRecipes().subscribe(
      () => {
        console.log('Recipes fetched successfully via ngOnInit.');
      },
      error => {
        console.error('Error fetching recipes in ngOnInit: ', error);
      }
    );
  }

  // loadRecipes() {
  //   this.isLoading = true;
  //   this.recipesService.getRecipes().subscribe({
  //     next: (recipes) => {
  //       this.recipes = recipes;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error('Failed to load recipes', err);
  //       this.isLoading = false;
  //     },
  //   });
  // }

  handleRefresh(event: RefresherCustomEvent) {
    this.recipesService.getRecipes().subscribe(
      () => {
        console.log('Recipes refreshed successfully!');
        event.target.complete();
      },
      error => {
        console.error('Error refreshing recipes:', error);
        event.target.complete();
      }
    );
  }
  
  refreshRecipes() {
    this.recipesService.getRecipes().subscribe(
      () => console.log('Recipes reloaded by button.'),
      error => console.error('Error reloading recipes by button:', error)
    );
  }
}
