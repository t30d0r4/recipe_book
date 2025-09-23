import { Component, OnInit } from '@angular/core';
import { UserService, UserSummary } from '../services/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.page.html',
  styleUrls: ['./profile-page.page.scss'],
  standalone: false,
})
export class ProfilePagePage implements OnInit {
  user: UserSummary = new UserSummary();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getMyUser().subscribe({
      next: (user) => {
        this.user = user;
        console.log('User loaded:', this.user);
      },
      error: (err) => {
        console.error('Failed to load user:', err);
      },
    });
  }
}
