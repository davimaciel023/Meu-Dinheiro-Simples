import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrcamentoService } from 'src/app/services/orcamento.service';
import { TransacaoService } from 'src/app/services/transacao.service';
import { Auth, user } from '@angular/fire/auth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-orcamento',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './orcamento.page.html',
  styleUrls: ['./orcamento.page.scss']
})
export class OrcamentoPage implements OnInit {
  orcamento: any = null;
  limiteInput: number = 0;
  gastoAtual: number = 0;
  percentualGasto: number = 0;
  restante: number = 0;
  mesAtual: string = '';
  carregando: boolean = true;
  editar: boolean = false;
  userId: string = '';

  constructor(
    private orcamentoService: OrcamentoService,
    private transacaoService: TransacaoService,
    private auth: Auth,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    try {
      this.carregando = true;

      const currentUser = await firstValueFrom(user(this.auth));
      if (!currentUser || !currentUser.uid) {
        console.error('Usuário não autenticado.');
        return;
      }

      this.userId = currentUser.uid;
      const agora = new Date();
      this.mesAtual = format(agora, 'MMMM yyyy', { locale: ptBR });

      const orcamentoDoc = await this.orcamentoService.getOrcamentoMensalOnce(this.userId, this.mesAtual);
      this.orcamento = orcamentoDoc;
      this.limiteInput = orcamentoDoc?.limiteMensal || 0;

      this.transacaoService.getTransacoes().subscribe((todas) => {
        const transacoesMes = todas.filter((t) => {
          if (!t.date) return false;
          const data = new Date(t.date);
          return data.getMonth() === agora.getMonth() && data.getFullYear() === agora.getFullYear();
        });

        this.gastoAtual = transacoesMes
          .filter((t) => t.type === 'saida')
          .reduce((total, t) => total + t.value, 0);

        if (this.orcamento) {
          this.percentualGasto = this.orcamento.limiteMensal > 0
            ? this.gastoAtual / this.orcamento.limiteMensal
            : 0;
          this.restante = this.orcamento.limiteMensal - this.gastoAtual;
        }

        this.carregando = false;
      });

    } catch (err) {
      console.error('Erro ao carregar orçamento:', err);
      this.carregando = false;
    }
  }

  async salvarOrcamento() {
    if (!this.limiteInput || this.limiteInput <= 0) {
      return this.exibirAlerta('Por favor, insira um limite válido.');
    }

    await this.orcamentoService.setOrcamentoMensal(this.userId, this.mesAtual, this.limiteInput);

    this.orcamento = {
      limiteMensal: this.limiteInput
    };

    this.percentualGasto = this.limiteInput > 0 ? this.gastoAtual / this.limiteInput : 0;
    this.restante = this.limiteInput - this.gastoAtual;
    this.editar = false;

    const toast = await this.toastCtrl.create({
      message: 'Orçamento salvo com sucesso!',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async salvarLimite() {
    await this.salvarOrcamento();
  }

  async exibirAlerta(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Atenção',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }
}
