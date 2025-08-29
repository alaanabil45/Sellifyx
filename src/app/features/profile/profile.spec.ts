import { TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, my-profile');
  });
});

