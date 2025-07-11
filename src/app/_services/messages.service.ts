import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../_models/user';
import { Group } from '../_models/group';
import { BusyService } from './busy.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  baseUrl = environment.apiUrl + 'messages/';
  hubUrl = environment.hubsUrl;
  private http = inject(HttpClient);
  private busyService = inject(BusyService);
  hubsConnection?: HubConnection;
  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);
  messageThread = signal<Message[]>([]);

  createHubConnection(user: User, otherUsername: string) {
    this.busyService.busy();
    this.hubsConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token ?? ''
      })
      .withAutomaticReconnect()
      .build();

    this.hubsConnection.start().catch(error => console.log(error)).finally(()=> this.busyService.idle());

    this.hubsConnection.on('ReceiveMessageThread', messages => {
      this.messageThread.set(messages)
    });

    this.hubsConnection.on('NewMessage', message => {
      this.messageThread.update(messages => [...messages, message])
    });

    this.hubsConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some(x => x.username === otherUsername)) {
        this.messageThread.update(messages => {
          messages.forEach(message => {
            if (!message.dateRead) {
              message.dateRead = new Date(Date.now()).toString();
            }
          })
          return messages;
        })
      }
    })
  }

  stopHubConnection() {
    if (this.hubsConnection?.state === HubConnectionState.Connected) {
      this.hubsConnection.stop().catch(error => console.log(error));
    }
  }
  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = setPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);

    return this.http.get<Message[]>(this.baseUrl, { observe: 'response', params })
      .subscribe({
        next: response => setPaginatedResponse(response, this.paginatedResult)
      });
  }
  getMessagesThread(userName: string) {
    return this.http.get<Message[]>(this.baseUrl + 'thread/' + userName.toLowerCase());
  }
  async sendMessage(username: string, content: string) {
    return this.hubsConnection?.invoke('SendMessage', {
      RecipientUsername: username,
      Content: content
    });

    // return this.http.post<Message>(this.baseUrl, {
    //   RecipientUserName: username,
    //   Content: content
    // });
  }
  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + id);
  }
}
