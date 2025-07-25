import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organizacao',
  templateUrl: './organizacao.page.html',
  styleUrls: ['./organizacao.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class OrganizacaoPage {
  valorEntrada: number | null = null;
  resultado: {
    poupanca: number;
    investimento: number;
    despesas: number;
    recompensas: number;
  } | null = null;

  constructor(private toastController: ToastController) {}

  async calcularDistribuicao() {
    if (!this.valorEntrada || this.valorEntrada <= 0) {
      const toast = await this.toastController.create({
        message: 'Por favor, insira um valor válido.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    const valor = this.valorEntrada;
    this.resultado = {
      poupanca: valor * 0.15,
      investimento: valor * 0.25,
      despesas: valor * 0.50,
      recompensas: valor * 0.10
    };
  }
}
