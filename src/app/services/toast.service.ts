import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
const ACCESS_TOKEN = 'my-token';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}
  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      cssClass: ['tabs-bottom', 'custom-toast'],
      swipeGesture: 'vertical',
      position: 'bottom',
      color: color,
    });

    await toast.present();
  }
}
