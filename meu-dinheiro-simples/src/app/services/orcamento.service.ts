import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrcamentoService {
  constructor(private firestore: Firestore) {}

  private gerarIdOrcamento(userId: string, mes: string): string {
    return `${userId}_${mes}`;
  }

  async setOrcamentoMensal(userId: string, mes: string, limite: number): Promise<void> {
    const id = this.gerarIdOrcamento(userId, mes);
    const ref = doc(this.firestore, 'orcamentos', id);
    await setDoc(ref, {
      userId,
      mes,
      limiteMensal: limite,
      atualizadoEm: new Date()
    });
  }

  getOrcamentoMensal(userId: string, mes: string): Observable<any> {
    const id = this.gerarIdOrcamento(userId, mes);
    const ref = doc(this.firestore, 'orcamentos', id);
    return docData(ref);
  }

  async getOrcamentoMensalOnce(userId: string, mes: string): Promise<any | null> {
    const id = this.gerarIdOrcamento(userId, mes);
    const ref = doc(this.firestore, 'orcamentos', id);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  }
}
