import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../services/recipe.service';
import { RefresherCustomEvent } from '@ionic/angular';
import { Recipe } from '../models/recipe.model';
import { UserService, UserSummary } from '../services/user.service';
import { IonSearchbar } from '@ionic/angular/standalone';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-all-recipes',
  templateUrl: './all-recipes.page.html',
  styleUrls: ['./all-recipes.page.scss'],
  standalone: false,
})
export class AllRecipesPage implements OnInit {
  recipes: Recipe[] = [];
  users: UserSummary[] = [];
  isLoading = false;
  searchControl = new FormControl(''); 
  private recipeSubject = new BehaviorSubject<Recipe[]>([]);
  public filteredItems$!: Observable<Recipe[]>; 

  constructor(
    private recipesService: RecipesService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadRecipes();
    this.loadUsers();
    const search$: Observable<string> = this.searchControl.valueChanges.pipe(debounceTime(150), 
      startWith(''),
      map(term => (term as string).toLowerCase()) 
  );

  this.filteredItems$ = combineLatest([
      this.recipeSubject.asObservable(),
      search$,
    ]).pipe(
      map(([recipes, searchTerm]) => {
        if (!searchTerm || searchTerm.trim() === '') {
          return recipes;
        }
        return recipes.filter(recipe => 
          recipe.title.toLowerCase().includes(searchTerm) 
        );
      })
    );
  }

  loadRecipes() {
    this.isLoading = true;
    this.recipesService.getRecipes().subscribe({
      next: (summaries) => {
        this.recipes = summaries;
        this.recipeSubject.next(summaries);
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
        console.log(this.users);
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
  refreshRecipes() {
    this.loadRecipes();
  }
}
