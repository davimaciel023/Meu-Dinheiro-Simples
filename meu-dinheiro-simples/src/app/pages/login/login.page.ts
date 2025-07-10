import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logoGoogle } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    addIcons({ logoGoogle })
  }

  async login() {
    this.loading = true;
    this.error = '';
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } catch (err: any) {
      this.error = 'E-mail ou senha inválidos';
    } finally {
      this.loading = false;
    }
  }

  async loginComGoogle() {
    try {
      await this.auth.loginWithGoogle();
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } catch (err) {
      this.error = 'Erro ao logar com Google';
    }
  }

  register() {
    this.router.navigate(['/register'])
  }
}
