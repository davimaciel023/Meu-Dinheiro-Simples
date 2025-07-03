import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NovaTransacaoPage } from './nova-transacao.page';

describe('NovaTransacaoPage', () => {
  let component: NovaTransacaoPage;
  let fixture: ComponentFixture<NovaTransacaoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NovaTransacaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
