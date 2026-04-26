import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageStreamService {
  getAssistantReply(prompt: string): Observable<{ role: string; content: string }> {
    const mockReply = {
      role: 'assistant',
      content: `Yanıt: ${prompt}`
    };
    return of(mockReply).pipe(delay(1000));  // Yazıyor simülasyonu
  }
}
