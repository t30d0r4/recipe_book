import { Component, OnInit } from '@angular/core';
import { FormField, FormComponent } from '../components/form/form.component';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { finalize } from 'rxjs/operators';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
    private firebaseService: FirebaseService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
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
    this.images = this.images.filter(image => image.file !== fileToRemove);
  }

  async onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creating recipe...'
    });
    await loading.present();

    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not logged in');
      }
      
      const imageUrls: string[] = [];
      if (this.images.length > 0) {
        const storage = getStorage();

        for (const image of this.images) {
          const filePath = `recipe_images/${currentUser.id}/${new Date().getTime()}_${image.file.name}`;
          const storageRef = ref(storage, filePath);

          await uploadBytes(storageRef, image.file);
          const url = await getDownloadURL(storageRef);
          imageUrls.push(url);
        }
      }
      const values = this.form.value;
      const recipeData = {
        title: values.title,
        description: values.description,
        ingredients: values.ingredients.split('\n').filter((ingredient: string) => ingredient.trim() !== ''),
        difficulty: Number(values.difficulty),
        totalTime: Number(values.totalTime),
        servings: Number(values.servings),
        createdBy: currentUser.id,
        author: `${currentUser.firstName} ${currentUser.lastName}`.trim() || currentUser.username,
        createdAt: new Date(),
        images: imageUrls // Add image URLs to the recipe data
      };

      // 3. Add Recipe Data to Firestore
      await this.firebaseService.addRecipe(recipeData);

      // Dismiss loading and show success alert
      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Success!',
        message: 'Recipe created successfully!',
        buttons: ['OK']
      });
      await alert.present();

      this.router.navigate(['/my-recipes']);
      this.form.reset();

    } catch (error: any) {
      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Error',
        message: error.message || 'Failed to create recipe',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
