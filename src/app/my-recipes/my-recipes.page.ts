import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { RecipesService } from '../services/recipe.service';
import { RefresherCustomEvent } from '@ionic/angular';
import { RecipeSummary } from '../models/recipe-summary.model';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.page.html',
  styleUrls: ['./my-recipes.page.scss'],
  standalone: false,
})
export class MyRecipesPage implements OnInit {
  recipes: RecipeSummary[] = [];
  isLoading = false;

  constructor(private recipesService: RecipesService) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.isLoading = true;
    this.recipesService.getMyRecipes().subscribe({
      next: (summaries) => {
        this.recipes = summaries;
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
}
