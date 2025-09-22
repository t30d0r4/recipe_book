import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';

export interface FormField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  validators?: ValidatorFn[];
  options?: { value: any, label: string }[];
}
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: false
})
export class FormComponent  implements OnInit {
  @Input() fields: FormField[] = [];
  @Input() submitLabel?: string;
  @Input() cardTitle?: string;
  @Input() groupValidators: ValidatorFn[] = [];
  @Output() formSubmit = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    const formGroupConfig: any = {};
    this.fields.forEach(field => {
      formGroupConfig[field.name] = ['', field.validators || []];
    });
    this.form = this.formBuilder.group(formGroupConfig, { validators: this.groupValidators });
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  clearForm() {
  this.form.reset();
  }
}

