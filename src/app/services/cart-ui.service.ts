import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartUiService {
  private readonly isOpenSubject = new BehaviorSubject<boolean>(false);
  readonly isOpen$ = this.isOpenSubject.asObservable();

  open() { this.isOpenSubject.next(true); }
  close() { this.isOpenSubject.next(false); }
  toggle() { this.isOpenSubject.next(!this.isOpenSubject.value); }
  get isOpen(): boolean { return this.isOpenSubject.value; }

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();
  private readonly loadingMessageSubject = new BehaviorSubject<string>('');
  readonly loadingMessage$ = this.loadingMessageSubject.asObservable();

  showLoading(message: string) {
    this.loadingMessageSubject.next(message);
    this.loadingSubject.next(true);
  }

  hideLoading() {
    this.loadingSubject.next(false);
    this.loadingMessageSubject.next('');
  }
}


