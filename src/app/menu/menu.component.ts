import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core/components';
import { AuthService } from '../services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false,
})
export class MenuComponent  implements OnInit {

  constructor(
    private menu: MenuController, 
    private router: Router,
    private authService: AuthService
  ) { }
  ngOnInit() {}
public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'Yes',
      role: 'confirm',
      handler: () => {
        this.logout();
      },
    },
  ];
 
  setResult(event: CustomEvent<OverlayEventDetail>) {
    console.log(`Dismissed with role: ${event.detail.role}`);
  }
 
  logout() {
    this.closeMenu();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
 
  closeMenu() {
    this.menu.close();
  }
}
