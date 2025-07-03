import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Transacao } from '../models/transacao.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransacaoService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  addTransacao(transacao: Transacao) {
    const userId = this.authService.getUserId();
    if (!userId) throw new Error("Usuário não autenticado");

    const ref = collection(this.firestore, `users/${userId}/transactions`);
    return addDoc(ref, transacao);
  }

  getTransacoes(): Observable<Transacao[]> {
    const userId = this.authService.getUserId();
    if (!userId) throw new Error("Usuário não autenticado");

    const ref = collection(this.firestore, `users/${userId}/transactions`);
    return collectionData(ref, { idField: 'id' }) as Observable<Transacao[]>;
  }
}
