import { Injectable } from '@angular/core';

interface Message<T> {
  request: string;
  data: T;
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  socket: WebSocket = new WebSocket('http://localhost:8080/');

  constructor() {}
  sendMessage<T>(request: string, data: T): number {
    let id = Math.floor(Math.random() * 1000000000000);
    this.socket.send(JSON.stringify({ request, data, id } as Message<T>));
    return id;
  }

  permanentListener<T>(name: string, callback: (data: T) => void) {
    let listener = async (event: MessageEvent<any>) => {
      let result = JSON.parse(event.data) as Message<T>;
      if (result.request !== name) {
        return;
      }
      callback(result.data);
    };
    this.socket.addEventListener('message', listener);
  }

  async getResponse<T, U>(
    request: string,
    data: T,
    callback: (data: U) => void
  ) {
    let id = this.sendMessage(request, data);
    let output: U | undefined = undefined;
    let listener = async (event: MessageEvent<any>) => {
      let result = JSON.parse(event.data) as Message<U>;
      if (result.id !== id || result.request !== request) {
        return;
      }
      this.socket.removeEventListener('message', listener);
      callback(result.data);
    };
    this.socket.addEventListener('message', listener);
  }

  resetDB(really: boolean) {
    if (!really) {
      return;
    }
    this.sendMessage('reset', null);
  }
}
