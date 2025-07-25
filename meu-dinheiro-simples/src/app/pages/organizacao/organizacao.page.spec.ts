import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizacaoPage } from './organizacao.page';

describe('OrganizacaoPage', () => {
  let component: OrganizacaoPage;
  let fixture: ComponentFixture<OrganizacaoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizacaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
