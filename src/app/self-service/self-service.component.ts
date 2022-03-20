import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { PrimeNGConfig } from 'primeng/api';
import { AnjunganService } from "../services/anjungan.service";
import { MessageService, ConfirmationService } from 'primeng/api';
import { ErrorService } from "../services/error.service";

@Component({
  selector: 'app-self-service',
  templateUrl: './self-service.component.html',
  styleUrls: ['./self-service.component.css'],
  providers: [ MessageService, ConfirmationService ]
})
export class SelfServiceComponent implements OnInit {

  loading : boolean = false;
  panel : any = {
    bpjs: false,
    tunai: false,
    baru: false
  }

  confirmation(){
    this.confirmService.confirm({
      message: 'Yakin data anda sudah benar?',
      accept: () => {
        this.loading = true;
        setTimeout(()=>{
          this.loading = false;
        }, 2000);
      }
    })
  }

  setPanelStatus(type:string, status:boolean){
    if( type == 'online' )
      this.anjunganservice.panel.online.next(status);
    if( type == 'bpjs' )
      this.anjunganservice.panel.bpjs.next(status);
    if( type == 'tunai' )
      this.anjunganservice.panel.tunai.next(status);
    if( type == 'pasienBaru' )
      this.anjunganservice.panel.pasienBaru.next(status);
  }

  constructor(
    private primengConfig: PrimeNGConfig,
    private anjunganservice: AnjunganService,
    private confirmService: ConfirmationService,
    private errorService: ErrorService
  ){}

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.errorService.getErrorStatus().subscribe(err => {
      if( err.message ){
        this.loading = false;
      }
    })
  }

}
