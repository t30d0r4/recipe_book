import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateRecipePageRoutingModule } from './create-recipe-routing.module';
import { CreateRecipePage } from './create-recipe.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateRecipePageRoutingModule,
    SharedModule
  ],
  declarations: [CreateRecipePage]
})
export class CreateRecipePageModule {}
