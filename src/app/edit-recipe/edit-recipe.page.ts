import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UserService, UserSummary } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { RecipesService } from '../services/recipe.service';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.page.html',
  styleUrls: ['./edit-recipe.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class EditRecipePage implements OnInit {
  recipe!: Recipe;
  ingredientsString: string = '';

  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService,
    private router: Router
  ) {}

  ngOnInit() {
    // Dohvati recept iz resolver-a
    this.recipe = this.route.snapshot.data['recipe'];
    this.ingredientsString = this.recipe.ingredients.join(', ');
  }

  saveRecipe() {
    // Pretvori string u array
    this.recipe.ingredients = this.ingredientsString
      .split(',')
      .map((i) => i.trim());

    this.recipesService.updateRecipe(this.recipe).subscribe(() => {
      console.log('Recipe updated!');
      this.router.navigate(['/all-recipes']);
    });
  }
}
