import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { RecipesService } from '../services/recipe.service';
import { RefresherCustomEvent } from '@ionic/angular';
import { UserService, UserSummary } from '../services/user.service';
import { AuthService } from '../services/auth.services';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.page.html',
  styleUrls: ['./my-recipes.page.scss'],
  standalone: false,
})
export class MyRecipesPage implements OnInit {
  recipes: Recipe[] = [];
  users: UserSummary[] = [];
  isLoading = false;

  constructor(
    private recipesService: RecipesService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadRecipes();
    this.loadUsers();
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

  loadUsers() {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
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
