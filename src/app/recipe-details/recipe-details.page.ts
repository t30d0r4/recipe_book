import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../services/recipe.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class RecipeDetailsPage implements OnInit {
  recipe!: Recipe;
  ingredientsString: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipesService: RecipesService
  ) { }

  ngOnInit() {
    this.recipe = this.route.snapshot.data['recipe'];
    this.ingredientsString = this.recipe.ingredients.join(', ');
  }

  goBack() {
    this.router.navigate(['/all-recipes']);
  }

  onClick() {
    this.router.navigateByUrl('/edit-recipe/' + this.recipe.id);
  }

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    zoom: true,
  };

  openPhoto(photo: string) {
    console.log('Photo clicked:', photo);
    // Optionally open full-screen modal
  }
}
