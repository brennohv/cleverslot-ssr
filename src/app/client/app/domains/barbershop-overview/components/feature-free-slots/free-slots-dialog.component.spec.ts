import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeSlotsDialogComponent } from './free-slots-dialog.component';

describe('FreeSlotsDialogComponent', () => {
  let component: FreeSlotsDialogComponent;
  let fixture: ComponentFixture<FreeSlotsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreeSlotsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FreeSlotsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
