import { Component, ElementRef, ViewChild, AfterViewChecked, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatComponent implements AfterViewChecked {
  userMessage: string = '';
  isTyping: boolean = false;

  messages: { text: string, fromUser: boolean, timestamp: string }[] = [];
  selectedMode: string = 'assistant';
  showEmojiPicker: boolean = false;

  @ViewChild('scrollMe') private messageContainer!: ElementRef;

  constructor(private http: HttpClient) {
    console.log('ChatComponent has been initialized.');
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  sendMessage() {
    const message = this.userMessage.trim();
    const maskedMessage = this.maskPII(message);

    if (!message) return;

    this.messages.push({
      text: maskedMessage,
      fromUser: true,
      timestamp: new Date().toLocaleTimeString()
    });

    this.userMessage = '';
    this.isTyping = true;

    this.http.post<{ response: string }>('http://localhost:5022/chat', {
      message: maskedMessage,
      mode: this.selectedMode
    })
    .subscribe({
      next: (res) => {
        this.isTyping = false;
        this.messages.push({
          text: res.response,
          fromUser: false,
          timestamp: new Date().toLocaleTimeString()
        });
      },
      error: (err) => {
        this.isTyping = false;
        this.messages.push({
          text: 'Unable to reach the server. The API quota may have been exceeded or the service is unavailable.',
          fromUser: false,
          timestamp: new Date().toLocaleTimeString()
        });
        console.error('API Error:', err);
      }
    });
  }

  maskPII(text: string): string {
    text = text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '***@***');
    text = text.replace(/\b\d{10,11}\b/g, '***PHONE***');
    text = text.replace(/\b\d{11}\b/g, '***TCKN***');
    return text;
  }

  handleFeedback(index: number, type: 'up' | 'down') {
    const message = this.messages[index];
    console.log(`Feedback on message [${index}]:`, type, message.text);
  }

  attachFile() {
    console.log('attachFile is not implemented yet');
  }

  addEmoji(emoji: string) {
    this.userMessage += emoji;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.emoji-popover') || target.closest('.emoji-button');
    if (!clickedInside) {
      this.showEmojiPicker = false;
    }
  }
}
