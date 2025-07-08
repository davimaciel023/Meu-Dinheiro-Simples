import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonicModule, NavController, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransacaoService } from 'src/app/services/transacao.service';
import { Transacao } from 'src/app/models/transacao.model';
import { delay } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './transacoes.page.html',
  styleUrls: ['./transacoes.page.scss']
})
export class TransacoesPage implements OnInit {
  transacoesAgrupadas: { titulo: string, transacoes: Transacao[] }[] = [];
  filtroTipo = 'todos';
  filtroCategoria = 'todas';
  filtroMes = 'todos';

  categorias: string[] = [];
  mesesDisponiveis: string[] = [];
  todasTransacoes: Transacao[] = [];
  carregando = true;

  constructor(
    private transacaoService: TransacaoService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ trashOutline, createOutline })
  }

  ngOnInit() {
    this.carregando = true;
    this.transacaoService.getTransacoes().pipe(delay(0)).subscribe((dados) => {
      this.todasTransacoes = dados;

      this.categorias = [...new Set(dados.map(t => t.category).filter(c => !!c))];
      this.mesesDisponiveis = [...new Set(dados.map(t => {
        const data = new Date(t.date);
        return data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      }))];

      this.aplicarFiltros();
      this.carregando = false;
      this.cdr.detectChanges();
    });
  }

  aplicarFiltros() {
    let filtradas = [...this.todasTransacoes];

    if (this.filtroTipo !== 'todos') {
      filtradas = filtradas.filter(t => t.type === this.filtroTipo);
    }

    if (this.filtroCategoria !== 'todas') {
      filtradas = filtradas.filter(t => t.category === this.filtroCategoria);
    }

    if (this.filtroMes !== 'todos') {
      filtradas = filtradas.filter(t => {
        const mes = new Date(t.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        return mes === this.filtroMes;
      });
    }

    const agrupado: { [key: string]: Transacao[] } = {};

    filtradas.forEach((t) => {
      const data = new Date(t.date);
      const hoje = new Date();
      const ontem = new Date();
      ontem.setDate(hoje.getDate() - 1);

      let chave: string;

      if (data.toDateString() === hoje.toDateString()) {
        chave = 'Hoje';
      } else if (data.toDateString() === ontem.toDateString()) {
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
    })).sort((a, b) => {
      const dataA = new Date(a.transacoes[0].date);
      const dataB = new Date(b.transacoes[0].date);
      return +dataB - +dataA;
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
            this.ngOnInit(); // Atualiza novamente
          }
        }
      ]
    });

    await alert.present();
  }

  trackByGrupo(index: number, grupo: { titulo: string; transacoes:  Transacao[] }) {
    return grupo.titulo;
  }

  trackById(index: number, item: Transacao) {
    return item.id;
  }

}
