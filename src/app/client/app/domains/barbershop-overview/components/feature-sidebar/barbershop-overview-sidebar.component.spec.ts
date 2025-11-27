import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopOverviewSidebarComponent } from './barbershop-overview-sidebar.component';

describe('BarbershopOverviewSidebarComponent', () => {
  let component: BarbershopOverviewSidebarComponent;
  let fixture: ComponentFixture<BarbershopOverviewSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopOverviewSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarbershopOverviewSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
