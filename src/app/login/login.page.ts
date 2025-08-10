import { Component, OnInit } from '@angular/core';
import { FormField } from '../components/form/form.component';
import { Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  fields: FormField[] = [
    {name: 'username', label: 'Username', validators: [Validators.required]},
    {name: 'password', label: "Password", validators: [Validators.required]}
  ];

  onFormSubmit(values: any){
    this.router.navigate(['/all-recipes'])
  }
  constructor(private router: Router) { }

  ngOnInit() {
  }

}
