import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { pipe, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AnnouncementMessage } from './announcementMessage.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  public messages: AnnouncementMessage[] = [];
  private connectionUrl = 'https://localhost:5001/announcementHub';
  private apiUrl = 'https://localhost:5001/api/chat';
  private hubConnection!: signalR.HubConnection;

  constructor(private http: HttpClient) { }

  public connect = () => {
    this.startConnection();
    this.addListeners();
  }

  public sendMessageToApi(message: string) {
    return this.http.post<AnnouncementMessage>(this.apiUrl, this.buildChatMessage(message))
    //return this.http.post(this.apiUrl, this.buildChatMessage(message))
    //.pipe(tap(_ => console.log("message sucessfully sent to api controller")));
  }

  public sendMessageToHub(message: string) {
    var promise = this.hubConnection.invoke("BroadcastAsync", this.buildChatMessage(message))
      .then(() => { console.log('message sent successfully to hub'); })
      .catch((err) => console.log('error while sending a message to hub: ' + err));

    return from(promise);
  }

  private getConnection(): signalR.HubConnection {
    return new signalR.HubConnectionBuilder()
      .withUrl(this.connectionUrl)
      //  .configureLogging(LogLevel.Trace)
      .build();
  }

  private buildChatMessage(message: string): AnnouncementMessage {
    return {
      connectionId: this.hubConnection.connectionId,
      text: message,
      dateTime: new Date()
    };
  }

  private startConnection() {
    this.hubConnection = this.getConnection();

    this.hubConnection.start()
      .then(() => console.log('connection started'))
      .catch((err) => console.log('error while establishing signalr connection: ' + err))
  }

  private addListeners() {
    this.hubConnection.on("messageReceivedFromApi", (data: AnnouncementMessage) => {
      console.log("message received from API Controller")
      this.messages.push(data);
    })
    this.hubConnection.on("messageReceivedFromHub", (data: AnnouncementMessage) => {
      console.log("message received from Hub", data)
      this.messages.push(data);
    })
    this.hubConnection.on("newUserConnected", _ => {
      console.log("new user connected")
    })
    this.hubConnection.on("group", (data: AnnouncementMessage) => {
      console.log(data);
    })
    this.hubConnection.on("groupMessage", (data: AnnouncementMessage) => {
      this.messages.push(data);
    })
  }

  joinGroup(groupName: string) {
    var promise = this.hubConnection.invoke("AddToGroup", groupName)
      .then(() => { console.log('Added To Group: ', groupName); })
      .catch((err) => console.log('error while joining group to hub: ' + err));

    return from(promise);
  }

  sendMessageToGroup(groupName: string, message: string) {
    var promise = this.hubConnection.invoke("SendMessageToGroup", groupName, this.buildChatMessage(message))
      .then(() => { console.log('Sent Message To Group: ', groupName); })
      .catch((err) => console.log(`error while sending group message to ${groupName}: ` + err));

    return from(promise);
  }
}
