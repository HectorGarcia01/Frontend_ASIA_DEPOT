import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOffersSectionComponent } from './product-offers-section.component';

describe('ProductOffersSectionComponent', () => {
  let component: ProductOffersSectionComponent;
  let fixture: ComponentFixture<ProductOffersSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductOffersSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductOffersSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
