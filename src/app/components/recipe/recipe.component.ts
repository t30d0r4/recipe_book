import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { Recipe } from 'src/app/models/recipe.model';
import { User } from 'src/app/models/user.model';
import { RecipesService } from 'src/app/services/recipe.service';
import { ToastService } from 'src/app/services/toast.service';
import { RecipeSummary } from 'src/app/models/recipe-summary.model';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
  imports: [CommonModule, IonicModule],
  standalone: true,
})
export class RecipeComponent {
  @Input() recipe!: RecipeSummary;
  @Input() users: User[] = [];
  @Input() myRecipes: boolean = false;
  message: string = '';
  @Output() deleted = new EventEmitter<void>();

  constructor(
    private recipeService: RecipesService,
    private router: Router,
    private toastService: ToastService
  ) {}
  onClick() {
    //this.router.navigateByUrl('/leave-requests/' + this.recipe.id);
  }
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
  getAuthorName(authorId: string): string {
    const user = this.users.find((u) => u.id === authorId);
    return user ? user.firstName + ' ' + user.lastName : 'Unknown';
  }
}
