import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import Keyboard from "simple-keyboard";
import { AnjunganService } from 'src/app/services/anjungan.service';
import { ErrorService } from 'src/app/services/error.service';
import { RegistrasiService } from 'src/app/services/registrasi.service';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css'],
  animations: [
    trigger('fade', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate(200)
      ])
    ])
  ]
})
export class OnlineComponent implements OnInit {

  @ViewChild('search', {static: false}) searchElement!: ElementRef;

  panelStatus : boolean = false;
  review : boolean = false;
  loading : boolean = false;
  keyboard !: Keyboard;
  value : string = "";
  booking : any = {};
  data : any = {
    rujukan : [],
    jadwal : [],
    kontrol: [],
    sep: []
  }
  selected : any = {
    rujukan : {},
    dokter : {},
    poli : {},
  }

  ngAfterViewInit() {
    this.buildKeyboard();
    this.value = '';
    this.data = {
      rujukan : [],
      jadwal : [],
      kontrol: [],
      sep: []
    }
    this.booking = {};
    this.review = false;
  }

  buildKeyboard() {
    setTimeout(() => {
      this.keyboard = new Keyboard({
        onChange: input => this.onChange(input),
        onKeyPress: (button: any) => this.onKeyPress(button)
      });
      this.searchElement.nativeElement.focus();
    }, 200);
  }

  destroyKeyboard(){
    this.keyboard.destroy();
  }

  onChange = (input: string) => {
    this.value = input;
  };

  onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") this.handleShift();
  };

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  onBlur() {
    this.searchElement.nativeElement.focus();
  }

  getKodeBooking(){
    this.registrasiService.getKodeBooking(this.value).subscribe(data => {
      if( !data.data ){
        this.messageService.add({key: 'c', severity:'error', summary: 'Perhatian', detail: 'Kode Booking Tidak Ditemukan.'});
      }else{
        this.booking = data.data;
        this.registrasiService.getRujukan(this.booking.no_referensi).subscribe(data => { this.selected.rujukan = data.response.rujukan; })
        this.registrasiService.getDokterBpjsById(this.booking.kodedokter_bpjs).subscribe(data => { this.selected.dokter = data.data })
        this.registrasiService.getPoliBpjsById(this.booking.poli).subscribe(data => { this.selected.poli = data.data })
      }
    })
  }

  listenKey(e:any){
    if( e.keyCode == 13 )
      this.getKodeBooking();
  }

  setPanelStatus(status:boolean){
    this.anjunganservice.panel.online.next(status);
  }

  getJadwal(idPoli:string){
    this.loading = true;
    this.data.jadwal = [];
    let data = {
      poli: idPoli,
      tgl: new Date().toLocaleDateString()
    }
    this.registrasiService.getJadwalDokter(data).subscribe(data => {
      if( data.metadata.code == 200 ){
        this.data.jadwal = data.response;
        this.loading = false;
      }else{
        this.messageService.add({key: 'c', severity:'error', summary: 'Perhatian', detail: 'Tidak ada jadwal dokter hari ini.'});
        this.loading = false;
      }
    })
  }

  constructor(
    private registrasiService: RegistrasiService,
    private messageService: MessageService,
    private anjunganservice: AnjunganService,
    private errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.errorService.getErrorStatus().subscribe(err => {
      if( err ){
        this.loading = false;
      }
    })

    this.anjunganservice.getPanelStatus().subscribe(status => {
      this.panelStatus = status;
    })

    this.anjunganservice.getPanelStatusOnline().subscribe(status => {
      this.panelStatus = status;
    })


  }

}
