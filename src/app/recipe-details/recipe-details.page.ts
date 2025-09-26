import { Component, EventEmitter, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../services/recipe.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlertButton} from '@ionic/angular';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.services';
import { User } from '../models/user.model';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class RecipeDetailsPage implements OnInit {
  recipe!: Recipe;
  ingredientsString: string = '';
  currentUser: User | null = null;
  steps: string[] = [];

  alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'Delete',
      role: 'confirm',
      handler: () => {
        this.deleteRecipe();
      },
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipesService: RecipesService,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.recipe = this.route.snapshot.data['recipe'];
    this.ingredientsString = this.recipe.ingredients.join(', ');
    this.currentUser = this.authService.getCurrentUser();
    this.steps = this.recipe.description.split('\n').filter(step => step.trim() !== '');
  }

  goBack() {
    this.router.navigate(['/all-recipes']);
  }

  editRecipe() {
    this.router.navigateByUrl('/edit-recipe/' + this.recipe.id);
  }

  async deleteRecipe() {
    this.recipesService.deleteRecipe(this.recipe.id).subscribe({
      next: () => {
        this.toastService.presentToast(
          'Recipe deleted successfully.',
          'success'
        );
        this.router.navigate(['/all-recipes']);
      },
      error: (err) => {
        this.toastService.presentToast(
          'Error while deleting recipe.',
          'danger'
        );
      },
    });
  }
}
