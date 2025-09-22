import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  
  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    console.log('Testing Firebase...');
    this.firebaseService.testConnection();
  }
}
