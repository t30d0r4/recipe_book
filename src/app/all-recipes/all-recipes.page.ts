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
 recipes: Recipe[] = [];
  isLoading = false;

  constructor(private recipesService: RecipesService) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.isLoading = true;
    this.recipesService.getRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load recipes', err);
        this.isLoading = false;
      },
    });
  }
  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      this.loadRecipes();
      event.target.complete();
    }, 2000);
  }
  refreshRecipes() {
    this.loadRecipes();
  }
}
