export interface Transacao {
  id?: string;
  type: 'entrada' | 'saida';
  value: number;
  category: string;
  date: string;
  description?: string;
}
