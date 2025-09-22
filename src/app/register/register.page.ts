import { Component, OnInit } from '@angular/core';
import { FormField } from '../components/form/form.component';
import { Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordMatchValidator } from '../validators/password.validator';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {

  fields: FormField[] = [
    { name: 'firstName', label: 'First Name', validators: [Validators.required] },
    { name: 'lastName', label: 'Last Name', validators: [Validators.required] },
    { name: 'username', label: 'Username', validators: [Validators.required] },
    { name: 'email', label: 'Email', type: 'email', validators: [Validators.required, Validators.email] },
    { name: 'password', label: 'Password', type: 'password', validators: [Validators.required, Validators.minLength(6)] },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', validators: [Validators.required] }
  ];

  groupValidators = [passwordMatchValidator];

  async onFormSubmit(values: any) {
    console.log('Register form submitted:', values);
    const { confirmPassword, ...userData } = values;

    const loading = await this.loadingController.create({
      message: 'Creating account...'
    });
    await loading.present();

    const result = await this.authService.register(userData);

    await loading.dismiss();

    if (result.success) {
      const alert = await this.alertController.create({
        header: 'Success!',
        message: 'Account created successfully!',
        buttons: ['OK']
      });
      await alert.present();
      
      // Navigate to all recipes after successful registration
      this.router.navigate(['/all-recipes']);
    } else {
      const alert = await this.alertController.create({
        header: 'Registration Failed',
        message: result.error || 'Something went wrong',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/all-recipes']);
    }
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }

}
