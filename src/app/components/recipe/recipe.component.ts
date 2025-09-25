import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Recipe } from 'src/app/models/recipe.model';
import { RecipesService } from 'src/app/services/recipe.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserSummary } from 'src/app/services/user.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
  imports: [CommonModule, IonicModule],
  standalone: true,
})
export class RecipeComponent {
  @Input() recipe!: Recipe;
  @Input() users: UserSummary[] = [];
  @Input() myRecipes: boolean = false;
  message: string = '';
  @Output() deleted = new EventEmitter<void>();

  constructor(
    private recipeService: RecipesService,
    private router: Router,
    private toastService: ToastService
  ) {}

  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Yes',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.onConfirmDelete();
      },
    },
  ];

  onConfirmDelete() {
    this.recipeService.deleteRecipe(this.recipe.id).subscribe({
      next: () => {
        this.toastService.presentToast(
          'Recipe deleted successfully.',
          'success'
        );
        this.deleted.emit();
      },
      error: (err) => {
        this.toastService.presentToast(
          'Error while deleting recipe.',
          'danger'
        );
      },
    });
  }
  get authorName(): string {
    const author = this.users.find((u) => u.id === this.recipe.author);
    return author ? author.username : 'Unknown';
  }

  public openDetails() {
     this.router.navigateByUrl('/recipe-details/' + this.recipe.id);
  }
}
