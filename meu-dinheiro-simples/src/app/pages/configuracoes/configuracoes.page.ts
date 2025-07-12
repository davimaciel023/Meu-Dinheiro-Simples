import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavController, ToastController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  imports: [IonicModule, FormsModule]
})
export class ConfiguracoesPage implements OnInit {
  temaEscuro = false;
  notificacoesAtivas = true;

  constructor(private navCtrl: NavController, private toastCtrl: ToastController) {}

  ngOnInit() {
    const temaSalvo = localStorage.getItem('tema');
    this.temaEscuro = temaSalvo === 'escuro';

    if (this.temaEscuro) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  alternarTema() {
    if (this.temaEscuro) {
      document.body.classList.add('dark');
      localStorage.setItem('tema', 'escuro');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('tema', 'claro');
    }
  }

  salvarPreferencias() {
    localStorage.setItem('notificacoes', this.notificacoesAtivas ? 'on' : 'off');
    this.toastCtrl.create({
      message: 'Preferências salvas',
      duration: 1500,
      color: 'success'
    }).then(toast => toast.present());
  }

  confirmarReset() {
    // Aqui pode abrir um AlertController para confirmar
    console.log('Resetar dados locais');
  }

  logout() {
    // Lógica de logout
    this.navCtrl.navigateRoot('/login');
  }
}
