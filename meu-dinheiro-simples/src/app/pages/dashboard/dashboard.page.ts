import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { TransacaoService } from 'src/app/services/transacao.service';
import { Transacao } from 'src/app/models/transacao.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IonicModule, CommonModule, NgChartsModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  transacoes: Transacao[] = [];
  totalEntradas = 0;
  totalSaidas = 0;
  saldo = 0;

  chartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: [] }]
  };

  constructor(private transacaoService: TransacaoService) {}

  ngOnInit() {
    this.transacaoService.getTransacoes().subscribe((data) => {
      this.transacoes = data;
      this.calcularTotais();
      this.gerarGrafico();
    });
  }

  calcularTotais() {
    this.totalEntradas = this.transacoes
      .filter(t => t.type === 'entrada')
      .reduce((acc, cur) => acc + cur.value, 0);

    this.totalSaidas = this.transacoes
      .filter(t => t.type === 'saida')
      .reduce((acc, cur) => acc + cur.value, 0);

    this.saldo = this.totalEntradas - this.totalSaidas;
  }

  gerarGrafico() {
    const categorias: { [key: string]: number } = {};

    this.transacoes.forEach((t) => {
      const cat = t.category;
      categorias[cat] = (categorias[cat] || 0) + t.value;
    });

    this.chartData = {
      labels: Object.keys(categorias),
      datasets: [{ data: Object.values(categorias) }]
    };
  }
}
