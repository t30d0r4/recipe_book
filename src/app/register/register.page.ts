import { Component, OnInit } from '@angular/core';
import { FormField } from '../components/form/form.component';
import { Validators } from '@angular/forms';
import { passwordMatchValidator } from '../validators/password.validator';

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

  onFormSubmit(values: any) {
    console.log('Register form submitted:', values);
  }

  constructor() { }

  ngOnInit() {
  }

}
