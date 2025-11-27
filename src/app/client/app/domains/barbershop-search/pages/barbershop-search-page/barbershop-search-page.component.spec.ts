import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopSearchPageComponent } from './barbershop-search-page.component';

describe('BarbershopSearchPageComponent', () => {
  let component: BarbershopSearchPageComponent;
  let fixture: ComponentFixture<BarbershopSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopSearchPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarbershopSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
