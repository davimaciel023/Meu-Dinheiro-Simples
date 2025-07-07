import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Transacao } from '../models/transacao.model';
import { Observable } from 'rxjs';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';


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


  deleteTransacao(id: string) {
    const userId = this.authService.getUserId();
    const ref = doc(this.firestore, `users/${userId}/transactions/${id}`);
    return deleteDoc(ref);
  }

  async getTransacaoById(id: string): Promise<Transacao | null> {
    const userId = this.authService.getUserId();
    const ref = doc(this.firestore, `users/${userId}/transactions/${id}`);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() as Transacao : null;
  }
}
