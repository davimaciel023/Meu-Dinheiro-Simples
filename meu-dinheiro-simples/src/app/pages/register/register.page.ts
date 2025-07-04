import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule]
})
export class RegisterPage {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async register() {
    this.loading = true;
    this.error = '';
    try {
      await this.auth.register(this.email, this.password);
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } catch (err: any) {
      this.error = 'Erro ao registrar. Verifique o e-mail.';
    } finally {
      this.loading = false;
    }
  }

  login(){
    this.router.navigate(['/login'])
  }
}
