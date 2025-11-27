import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopOverviewPageComponent } from './barbershop-overview-page.component';

describe('BarbershopOverviewPageComponent', () => {
  let component: BarbershopOverviewPageComponent;
  let fixture: ComponentFixture<BarbershopOverviewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopOverviewPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarbershopOverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
