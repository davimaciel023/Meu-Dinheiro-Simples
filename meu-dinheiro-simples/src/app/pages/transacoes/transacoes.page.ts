import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TransacaoService } from 'src/app/services/transacao.service';
import { Transacao } from 'src/app/models/transacao.model';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { NavController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [IonicModule, CommonModule, NgIf, NgFor],
  templateUrl: './transacoes.page.html',
  styleUrls: ['./transacoes.page.scss']
})
export class TransacoesPage implements OnInit {
  transacoes: Transacao[] = []
  carregando = true

  constructor(
    private transacaoService: TransacaoService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.transacaoService.getTransacoes().subscribe((dados) => {
      this.transacoes = dados.sort((a, b) => +new Date(b.date) - +new Date(a.date))

      this.carregando = false
    })
  }

  formatarData(data: string) {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  editarTransacao(transacao: Transacao) {
    this.navCtrl.navigateForward(`/tabs/nova-transacao?id=${transacao.id}`);
  }
  async confirmarExclusao(transacao: Transacao) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: 'Deseja excluir esta transação?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: async () => {
            await this.transacaoService.deleteTransacao(transacao.id!);
            const toast = await this.toastCtrl.create({
              message: 'Transação excluída.',
              duration: 2000,
              color: 'success'
            });
            toast.present();
          }
        }
      ]
    });

    await alert.present();
  }
}
