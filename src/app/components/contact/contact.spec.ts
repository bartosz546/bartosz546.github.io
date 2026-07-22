import { TestBed } from '@angular/core/testing';
import { Contact } from './contact';

describe('Contact', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contact],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Contact);
    const contact = fixture.componentInstance;
    expect(contact).toBeTruthy();
  });
});
