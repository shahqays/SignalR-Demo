import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from './announcement.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  title = 'chat-ui';
  text: string = "";
  groupName: string = "";
  groupMessage: string = "";

  constructor(public signalRService: AnnouncementService) {

  }

  ngOnInit(): void {
    this.signalRService.connect();
  }

  sendMessage(): void {
    // this.signalRService.sendMessageToApi(this.text).subscribe({
    //   next: _ => this.text = '',
    //   error: (err) => console.error(err)
    // });

    this.signalRService.sendMessageToHub(this.text).subscribe({
      next: _ => this.text = '',
      error: (err) => console.error(err)
    });
  }

  joinGroup(): void {
    this.signalRService.joinGroup(this.groupName).subscribe({
      next: _ => _ ,
      error: (err) => console.log(err)
    })
  }

  sendMessageToGroup(): void {
    this.signalRService.sendMessageToGroup(this.groupName, this.groupMessage).subscribe({
      next: _ => _ ,
      error: (err) => console.log(err)
    })
  }

}
