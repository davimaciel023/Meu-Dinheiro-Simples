import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TransacaoService } from 'src/app/services/transacao.service';
import { Transacao } from 'src/app/models/transacao.model';
import { NavController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './transacoes.page.html',
  styleUrls: ['./transacoes.page.scss']
})
export class TransacoesPage implements OnInit {
  transacoesAgrupadas: { titulo: string, transacoes: Transacao[] }[] = [];

  carregando = true

  constructor(
    private transacaoService: TransacaoService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
  this.transacaoService.getTransacoes().subscribe((dados) => {
    const agrupado: { [key: string]: Transacao[] } = {};

    dados.forEach((t) => {
      const data = new Date(t.date);
      const hoje = new Date();
      const ontem = new Date();
      ontem.setDate(hoje.getDate() - 1);

      let chave: string;

      if (
        data.toDateString() === hoje.toDateString()
      ) {
        chave = 'Hoje';
      } else if (
        data.toDateString() === ontem.toDateString()
      ) {
        chave = 'Ontem';
      } else {
        chave = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      }

      if (!agrupado[chave]) agrupado[chave] = [];
      agrupado[chave].push(t);
    });

    this.transacoesAgrupadas = Object.entries(agrupado).map(([titulo, transacoes]) => ({
      titulo,
      transacoes: transacoes.sort((a, b) => +new Date(b.date) - +new Date(a.date))
    }));

    // Ordena os grupos pela data da primeira transação
    this.transacoesAgrupadas.sort((a, b) => {
      const dataA = new Date(a.transacoes[0].date);
      const dataB = new Date(b.transacoes[0].date);
      return +dataB - +dataA;
    });

    this.carregando = false;
  });
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
