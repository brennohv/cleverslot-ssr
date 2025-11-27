import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopOverviewServicesComponent } from './barbershop-overview-services.component';

describe('BarbershopOverviewServicesComponent', () => {
  let component: BarbershopOverviewServicesComponent;
  let fixture: ComponentFixture<BarbershopOverviewServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopOverviewServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarbershopOverviewServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
