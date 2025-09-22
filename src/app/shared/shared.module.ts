import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormComponent } from '../components/form/form.component';

@NgModule({
  declarations: [FormComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonicModule],
  exports: [
    FormComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
  ],
})
export class SharedModule {}
