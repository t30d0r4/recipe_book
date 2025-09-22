import { Component, OnInit, ViewChild } from '@angular/core';
import { FormField, FormComponent } from '../components/form/form.component';
import { Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/authentication.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  @ViewChild(FormComponent) formComponent!: FormComponent;

  fields: FormField[] = [
    {name: 'username', label: 'Username', validators: [Validators.required]},
    {name: 'password', label: "Password", type: 'password', validators: [Validators.required]}
  ];

  async onFormSubmit(values: any){
    const loading = await this.loadingController.create({
      message: 'Logging in...'
    });
    await loading.present();

    const result = await this.authService.login(values.username, values.password);

    await loading.dismiss();

    if (result.success) {
      this.formComponent.clearForm();
      this.router.navigate(['/all-recipes']);
    } else {
      const alert = await this.alertController.create({
        header: 'Login Failed',
        message: result.error || 'Incorrect credentials',
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

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
