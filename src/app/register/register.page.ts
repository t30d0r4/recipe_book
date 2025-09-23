import { Component, OnInit } from '@angular/core';
import { FormField } from '../components/form/form.component';
import { Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordMatchValidator } from '../validators/password.validator';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.services';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  fields: FormField[] = [
    {
      name: 'firstName',
      label: 'First Name',
      validators: [Validators.required],
    },
    { 
      name: 'lastName', 
      label: 'Last Name', 
      validators: [Validators.required] 
    },
    { 
      name: 'username', 
      label: 'Username', 
      validators: [Validators.required] 
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      validators: [Validators.required, Validators.email],
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      validators: [Validators.required, Validators.minLength(6)],
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      validators: [Validators.required],
    },
  ];

  groupValidators = [passwordMatchValidator];

  async onFormSubmit(values: any) {
    console.log('Register form submitted:', values);

    const { confirmPassword, ...userData } = values;

    const loading = await this.loadingController.create({
      message: 'Creating account...',
    });
    await loading.present();

    try {
      await this.authService.register(userData).toPromise();

      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Success!',
        message: 'Account created successfully!',
        buttons: ['OK'],
      });
      await alert.present();

      this.router.navigate(['/all-recipes']);
    } catch (error: any) {
      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Registration Failed',
        message: error?.message || 'Something went wrong',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
  }
  
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
