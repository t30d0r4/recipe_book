import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
    standalone: false,
})
export class RecipeDetailsPage implements OnInit {
  recipe!: Recipe;
  ingredientsString: string = '';

  constructor(
     private route: ActivatedRoute,
    private recipesService: RecipesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.recipe = this.route.snapshot.data['recipe'];
    this.ingredientsString = this.recipe.ingredients.join(', ');
  }

  goBack() {
    this.router.navigate(['/all-recipes']);
  }

  editRecipe() {
    this.router.navigate(['/edit-recipe/', this.recipe.id]);
  }

}
