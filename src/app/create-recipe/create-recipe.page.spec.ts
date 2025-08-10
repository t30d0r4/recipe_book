import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateRecipePage } from './create-recipe.page';

describe('CreateRecipePage', () => {
  let component: CreateRecipePage;
  let fixture: ComponentFixture<CreateRecipePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRecipePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
