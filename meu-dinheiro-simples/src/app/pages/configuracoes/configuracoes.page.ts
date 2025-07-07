import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController, AlertController, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { signOut } from 'firebase/auth';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss']
})
export class ConfiguracoesPage implements OnInit {
  temaEscuro = false;
  notificacoesAtivas = true;

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private auth: Auth
  ) {}

  ngOnInit() {
    const temaSalvo = localStorage.getItem('tema');
    this.temaEscuro = temaSalvo === 'escuro';

    const notificacoesSalvas = localStorage.getItem('notificacoes');
    this.notificacoesAtivas = notificacoesSalvas !== 'false';
  }

  alternarTema() {
    const body = document.body;
    this.temaEscuro ? body.classList.add('dark') : body.classList.remove('dark');
    localStorage.setItem('tema', this.temaEscuro ? 'escuro' : 'claro');
  }

  salvarPreferencias() {
    localStorage.setItem('notificacoes', this.notificacoesAtivas.toString());
    this.mostrarToast('Preferências salvas.');
  }

  async confirmarReset() {
    const alert = await this.alertCtrl.create({
      header: 'Redefinir Dados',
      message: 'Isso apagará dados locais como preferências de tema e notificações. Deseja continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Redefinir',
          handler: () => {
            localStorage.clear();
            this.temaEscuro = false;
            this.notificacoesAtivas = true;
            document.body.classList.remove('dark');
            this.mostrarToast('Dados redefinidos com sucesso.');
          }
        }
      ]
    });
    await alert.present();
  }

  async logout() {
    await signOut(this.auth);
    this.navCtrl.navigateRoot('/login');
    this.mostrarToast('Você saiu da conta.');
  }

  async mostrarToast(mensagem: string) {
    const toast = await this.toastCtrl.create({
      message: mensagem,
      duration: 2000,
      color: 'primary'
    });
    toast.present();
  }
}
