import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransacaoService } from 'src/app/services/transacao.service';
import { Firestore, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Transacao } from 'src/app/models/transacao.model';

@Component({
  selector: 'app-orcamento',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './orcamento.page.html',
  styleUrls: ['./orcamento.page.scss']
})
export class OrcamentoPage implements OnInit {
  mesAtual: string = '';
  gastoAtual: number = 0;
  restante: number = 0;
  percentualGasto: number = 0;

  limiteInput: number = 0;
  orcamento: { limiteMensal: number } | null = null;

  constructor(
    private firestore: Firestore,
    private transacaoService: TransacaoService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    const hoje = new Date();
    this.mesAtual = hoje.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    this.carregarOrcamento();
    this.calcularGastosDoMes();
  }

  async carregarOrcamento() {
    const ref = doc(this.firestore, 'orcamentos', this.mesAtual);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      this.orcamento = snap.data() as { limiteMensal: number };
      this.calcularRestante();
    }
  }

  async salvarOrcamento() {
    if (this.limiteInput <= 0) {
      const toast = await this.toastCtrl.create({
        message: 'Defina um valor válido para o orçamento.',
        color: 'warning',
        duration: 2000
      });
      toast.present();
      return;
    }

    const ref = doc(this.firestore, 'orcamentos', this.mesAtual);
    await setDoc(ref, { limiteMensal: this.limiteInput });

    this.orcamento = { limiteMensal: this.limiteInput };
    this.calcularRestante();

    const toast = await this.toastCtrl.create({
      message: 'Orçamento salvo com sucesso!',
      color: 'success',
      duration: 2000
    });
    toast.present();
  }

  calcularGastosDoMes() {
    this.transacaoService.getTransacoes().subscribe((transacoes: Transacao[]) => {
      const hoje = new Date();
      const mes = hoje.getMonth();
      const ano = hoje.getFullYear();

      this.gastoAtual = transacoes
        .filter(t => {
          const data = new Date(t.date);
          return data.getMonth() === mes && data.getFullYear() === ano && t.type === 'saida';
        })
        .reduce((soma, t) => soma + t.value, 0);

      this.calcularRestante();
    });
  }

  calcularRestante() {
    if (!this.orcamento) return;
    this.restante = this.orcamento.limiteMensal - this.gastoAtual;
    this.percentualGasto = Math.min(this.gastoAtual / this.orcamento.limiteMensal, 1);
  }
}
