import { Component, inject, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { TransacaoService } from 'src/app/services/transacao.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orcamento',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './orcamento.page.html',
  styleUrls: ['./orcamento.page.scss']
})
export class OrcamentoPage implements OnInit {
  private firestore = inject(Firestore);
  private toastCtrl = inject(ToastController);

  orcamento: any = null;
  gastoAtual = 0;
  restante = 0;
  percentualGasto = 0;
  mesAtual = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  limiteInput: number = 0;
  editar = false;
  carregando = true;

  constructor(private transacaoService: TransacaoService) {}

  ngOnInit() {
    const docRef = doc(this.firestore, `orcamento/${this.mesAtual}`);

    docData(docRef).subscribe((dados) => {
      this.orcamento = dados;
      if (dados && 'limiteMensal' in dados) {
        this.orcamento = dados;
        this.limiteInput = dados['limiteMensal'];
      }
      this.atualizarGastos();
      this.carregando = false;
    }, () => {
      this.carregando = false;
    });
  }

  atualizarGastos() {
    this.transacaoService.getTransacoes().subscribe((transacoes) => {
      const mesAtual = new Date().getMonth();
      const anoAtual = new Date().getFullYear();

      const despesas = transacoes.filter(t => {
        const data = new Date(t.date);
        return t.type === 'saida' && data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
      });

      this.gastoAtual = despesas.reduce((total, t) => total + t.value, 0);
      this.restante = this.orcamento.limiteMensal - this.gastoAtual;
      this.percentualGasto = this.gastoAtual / this.orcamento.limiteMensal;
    });
  }

  async salvarLimite() {
    const docRef = doc(this.firestore, `orcamento/${this.mesAtual}`);
    await setDoc(docRef, { limiteMensal: this.limiteInput });

    this.orcamento = { limiteMensal: this.limiteInput };
    this.atualizarGastos();
    this.editar = false;

    const toast = await this.toastCtrl.create({
      message: 'Limite atualizado com sucesso!',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }
}
