import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLanguageSelectorComponent } from './profile-language-selector.component';

describe('ProfileLanguageSelectorComponent', () => {
  let component: ProfileLanguageSelectorComponent;
  let fixture: ComponentFixture<ProfileLanguageSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileLanguageSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileLanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
