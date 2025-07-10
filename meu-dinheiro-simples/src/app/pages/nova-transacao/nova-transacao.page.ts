import { Component } from '@angular/core';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransacaoService } from 'src/app/services/transacao.service';
import { Transacao } from 'src/app/models/transacao.model';
import { addIcons } from 'ionicons';
import { arrowDownOutline, arrowUpOutline } from 'ionicons/icons';

@Component({
  selector: 'app-nova-transacao',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './nova-transacao.page.html',
  styleUrls: ['./nova-transacao.page.scss']
})
export class NovaTransacaoPage {
  transacao: Transacao = {
    type: 'saida',
    value: null!,
    category: '',
    date: new Date().toISOString(),
    description: ''
  };

  categorias = [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Lazer',
    'Educação',
    'Saúde',
    'Outros'
  ];

  constructor(
    private transacaoService: TransacaoService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {
    addIcons({ arrowDownOutline, arrowUpOutline })
  }

  async salvar() {
    if (!this.transacao.value || !this.transacao.category || !this.transacao.date) {
      const toast = await this.toastCtrl.create({
        message: 'Preencha todos os campos obrigatórios.',
        duration: 2000,
        color: 'warning'
      });
      return toast.present();
    }

    try {
      await this.transacaoService.addTransacao(this.transacao);
      const toast = await this.toastCtrl.create({
        message: 'Transação salva com sucesso!',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      this.navCtrl.navigateBack('/tabs/dashboard');
    } catch (err) {
      const toast = await this.toastCtrl.create({
        message: 'Erro ao salvar transação.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}
