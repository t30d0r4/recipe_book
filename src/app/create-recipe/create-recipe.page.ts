import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../services/auth.services';
import { RecipesService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';

interface ImageFile {
  file: File;
  url: SafeUrl;
}

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.page.html',
  styleUrls: ['./create-recipe.page.scss'],
  standalone: false,
})
export class CreateRecipePage implements OnInit {
  form!: FormGroup;
  selectedDifficulty: number = 1;
  images: ImageFile[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private recipeService: RecipesService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    if (!this.authService.isUserAuthenticated) {
      this.router.navigate(['/login']);
    }

    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      ingredients: ['', [Validators.required]],
      difficulty: ['', [Validators.required]],
      totalTime: ['', [Validators.required, Validators.min(1)]],
      servings: ['', [Validators.required, Validators.min(1)]],
      images: [[]],
    });
  }

  selectDifficulty(level: number) {
    this.selectedDifficulty = level;
    this.form.patchValue({ difficulty: level });
  }

  onDifficultyChange(event: any) {
    this.selectedDifficulty = event.detail.value;
    this.form.patchValue({ difficulty: event.detail.value });
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (const file of files) {
        const fileUrl = URL.createObjectURL(file);
        const safeUrl = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
        this.images.push({ file, url: safeUrl });
      }
    }
  }

  removeImage(fileToRemove: File) {
    this.images = this.images.filter((image) => image.file !== fileToRemove);
  }
  async onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creating recipe...',
    });
    await loading.present();

    try {
      const currentUserId = this.authService.getUserId();
      if (!currentUserId) throw new Error('User not logged in');

      const values = this.form.value;

      const newRecipe: Recipe = new Recipe(
        '',
        values.title,
        values.description,
        currentUserId,
        Number(values.difficulty),
        values.ingredients.split('\n').filter((i: string) => i.trim() !== ''),
        Number(values.totalTime),
        Number(values.servings)
      );

      await this.recipeService.addRecipe(newRecipe).toPromise();

      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Success!',
        message: 'Recipe created successfully!',
        buttons: ['OK'],
      });
      await alert.present();

      this.router.navigate(['/my-recipes']);
      this.form.reset();
      this.images = [];
    } catch (error: any) {
      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Error',
        message: error.message || 'Failed to create recipe',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
