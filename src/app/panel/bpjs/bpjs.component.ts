import { Component, OnInit } from '@angular/core';
import { AnjunganService } from 'src/app/services/anjungan.service';
import { fadeIn } from 'src/app/shared/animations';

@Component({
  selector: 'app-bpjs',
  templateUrl: './bpjs.component.html',
  styleUrls: ['./bpjs.component.css'],
  animations: [fadeIn]
})
export class BpjsComponent implements OnInit {

  public panelStatus: boolean = false;

  constructor(
    private anjunganService: AnjunganService,
  ) { }

  ngOnInit(): void {
    this.anjunganService.getPanelStatusBpjs()
      .subscribe(status => {
        this.panelStatus = status;
        if (status) {
          this.anjunganService.buildKeyboard.next(true);
        } else {
          this.anjunganService.buildKeyboard.next(false);
        }
      })
    this.anjunganService.getOpenPanel()
      .subscribe(data => {
        this.closePanel();
      })
  }

  public closePanel() {
    this.anjunganService.panel.bpjs.next(false);
    this.anjunganService.buildKeyboard.next(false);
    this.anjunganService.openPanel.next(false);
  }


}
