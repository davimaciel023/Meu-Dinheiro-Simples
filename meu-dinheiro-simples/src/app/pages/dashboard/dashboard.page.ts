import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { TransacaoService } from 'src/app/services/transacao.service';
import { Transacao } from 'src/app/models/transacao.model';
import { ChartData } from 'chart.js';

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
      const cat = t.category || 'Outros';
      categorias[cat] = (categorias[cat] || 0) + t.value;
    });

    this.chartData = {
      labels: Object.keys(categorias),
      datasets: [{ data: Object.values(categorias) }]
    };
  }

  graficoMensalData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { label: 'Entradas', data: [], backgroundColor: 'green' },
      { label: 'Saídas', data: [], backgroundColor: 'red' }
    ]
  };
  gerarGraficoMensal() {
    const entradasPorMes: { [mes: string]: number } = {};
    const saidasPorMes: { [mes: string]: number } = {};

    this.transacoes.forEach((t) => {
      const mes = new Date(t.date).toLocaleString('pt-BR', { month: 'short', year: 'numeric' });

      if (t.type === 'entrada') {
        entradasPorMes[mes] = (entradasPorMes[mes] || 0) + t.value;
      } else if (t.type === 'saida') {
        saidasPorMes[mes] = (saidasPorMes[mes] || 0) + t.value;
      }
    });

    const todosOsMeses = Array.from(new Set([
      ...Object.keys(entradasPorMes),
      ...Object.keys(saidasPorMes)
    ])).sort((a, b) => {
      const [ma, ya] = a.split('/');
      const [mb, yb] = b.split('/');
      return new Date(+`20${ya}`, this.nomeMesParaNumero(ma)).getTime() -
            new Date(+`20${yb}`, this.nomeMesParaNumero(mb)).getTime();
    });

    this.graficoMensalData = {
      labels: todosOsMeses,
      datasets: [
        {
          label: 'Entradas',
          data: todosOsMeses.map(m => entradasPorMes[m] || 0),
          backgroundColor: 'green'
        },
        {
          label: 'Saídas',
          data: todosOsMeses.map(m => saidasPorMes[m] || 0),
          backgroundColor: 'red'
        }
      ]
    };
  }

  nomeMesParaNumero(mes: string): number {
    const mapa: { [key: string]: number } = {
      'jan': 0, 'fev': 1, 'mar': 2, 'abr': 3, 'mai': 4, 'jun': 5,
      'jul': 6, 'ago': 7, 'set': 8, 'out': 9, 'nov': 10, 'dez': 11
    };
    return mapa[mes.toLowerCase().slice(0, 3)] ?? 0;
  }
}
