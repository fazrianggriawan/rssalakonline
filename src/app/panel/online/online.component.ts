import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import Keyboard from "simple-keyboard";
import { config } from 'src/app/config';
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
    suratKontrol : {},
    sep : {},
    asalFaskes: ''
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

        if( this.booking.jns_kunjungan == 1 ){
          this.registrasiService.getRujukan(this.booking.no_referensi).subscribe(data => { this.selected.rujukan = data.response.rujukan; this.selected.asalFaskes = data.response.asalFaskes; })
        }else{
          this.registrasiService.getSep(this.booking.no_referensi).subscribe(data => {
            this.selected.sep = data.response;
            this.registrasiService.getRujukan(this.selected.sep.noRujukan).subscribe(data2 => { this.selected.rujukan = data2.response.rujukan; this.selected.asalFaskes = data2.response.asalFaskes; })
          })
        }

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

  finish(){
    let data = this.setFormSep();
    if( this.booking.jns_kunjungan == 1 ){
      this.saveSep(data);
    }else{
      this.createSuratKontrol();
    }

    console.log(data);
    console.log(this.selected);
  }

  createSuratKontrol(){
    let today = new Date();
    let data : any = {
      noSep: this.selected.sep.noSep,
      dokter: this.selected.dokter.kode,
      poli: this.selected.poli.kode,
      tgl: today.toLocaleDateString()
    }

    this.registrasiService.saveSuratKontrol(data).subscribe(data => {
      if( data.metaData.code == '200' ){
        this.selected.suratKontrol = data.response;
        let a = this.setFormSep();
        this.saveSep(a);
      }else{
        alert(data.metaData.message);
      }
    })
  }

  setFormSep(){
    var tujuanKunj = '0';
    var assesmentPel = '';
    var noSuratSkdp = '';
    var kodeDPJP = '';

    if( this.booking.jns_kunjungan != 1 ){
      tujuanKunj = '2';
      assesmentPel = '5';
      noSuratSkdp = this.selected.suratKontrol.noSuratKontrol;
      kodeDPJP = this.selected.dokter.kode;
    }

    let today = new Date();

    let data : any = {
      noKartu: this.booking.no_kartu_bpjs,
      tglSep: today.toLocaleDateString(),
      jnsPelayanan: '2',
      noMR: '818181',
      diagAwal: this.selected.rujukan.diagnosa,
      catatan: '-',
      cob: '0',
      katarak: '0',
      tujuanKunj: tujuanKunj,
      flagProcedure: '',
      kdPenunjang: '',
      assesmentPel: assesmentPel,
      dpjpLayan: this.selected.dokter.kode,
      isLakalantas: '0',
      tlp: '082110661682',
      poli: {
          tujuan: this.selected.poli,
          isEksekutif: '0'
      },
      klsRawat: {
          klsRawatHak: this.selected.rujukan.peserta.hakKelas.kode,
          klsRawatNaik: '',
          pembiayaan: '',
          penanggungJawab: '',
      },
      rujukan: {
          asalRujukan: this.selected.asalFaskes,
          tglRujukan: this.selected.rujukan.tglKunjungan,
          noRujukan: this.selected.rujukan.noKunjungan,
          ppkRujukan: this.selected.rujukan.provPerujuk.kode,
      },
      skdp: {
          noSurat: noSuratSkdp,
          kodeDPJP: kodeDPJP,
      },
      detailLaka: {
          penjamin: {
              tglKejadian: '',
              keterangan: '',
          },
          suplesi: {
              isSuplesi: '0',
              noSepSuplesi: ''
          },
          lokasiLaka: {
              kdPropinsi: '',
              kdKabupaten: '',
              kdKecamatan: ''
          }
      }
    }
    return data;
  }

  saveSep(data:any){
    this.registrasiService.saveSep(data).subscribe(data => {
      if( data.metaData.code == '200' ){
          this.printSep(data.response.sep.noSep)
        console.log('success');
      }else{
        alert(data.metaData.message);
      }
    })
  }

    printSep(noSep:string) {
        var iframe = '<iframe src="' + config.api_vclaim + '/sep/cetak/index?key=' + noSep + '" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>';
        window.open("", "", "width=1024,height=510,toolbar=no,menubar=no,resizable=yes")?.document.write(iframe);
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
