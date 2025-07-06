import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TransacaoService } from 'src/app/services/transacao.service';
import { Transacao } from 'src/app/models/transacao.model';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [IonicModule, CommonModule, AsyncPipe, NgIf, NgFor],
  templateUrl: './transacoes.page.html',
  styleUrls: ['./transacoes.page.scss']
})
export class TransacoesPage implements OnInit {
  transacoes: Transacao[] = []
  carregando = true

  constructor(
    private transacaoService: TransacaoService
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

}
