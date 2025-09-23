import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserSummary } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class ProfileComponent implements OnInit {
  @Input() user: UserSummary = new UserSummary();
  constructor() {}

  ngOnInit() {}
}
