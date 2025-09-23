import { Component, OnInit, ViewChild } from '@angular/core';
import { FormField, FormComponent } from '../components/form/form.component';
import { Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  @ViewChild(FormComponent) formComponent!: FormComponent;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  fields: FormField[] = [
    { 
      name: 'email', 
      label: 'Email', 
      validators: [Validators.required] 
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      validators: [Validators.required],
    },
  ];

  async onFormSubmit(values: any) {
    const loading = await this.loadingController.create({
      message: 'Logging in...',
    });
    await loading.present();

    this.authService
      .logIn({ email: values.email, password: values.password })
      .subscribe({
        next: async () => {
          await loading.dismiss();
          this.formComponent.clearForm();
          this.router.navigate(['/all-recipes']);
        },
        error: async (err) => {
          await loading.dismiss();

          let message = 'Login failed';
          if (err?.error?.error?.message) {
            message = err.error.error.message.replace(/_/g, ' ');
          }

          const alert = await this.alertController.create({
            header: 'Login Failed',
            message,
            buttons: ['OK'],
          });
          await alert.present();
        },
      });
  }

  ngOnInit() {
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
