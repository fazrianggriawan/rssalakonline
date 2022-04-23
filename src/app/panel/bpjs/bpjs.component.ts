import { animate, state, style, transition, trigger } from '@angular/animations';
import { formatDate, registerLocaleData } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import Keyboard from "simple-keyboard";
import { AnjunganService } from 'src/app/services/anjungan.service';
import { ErrorService } from 'src/app/services/error.service';
import { RegistrasiService } from 'src/app/services/registrasi.service';
import localeId from '@angular/common/locales/id';
import { config } from 'src/app/config';
import { AntrianService } from 'src/app/services/antrian.service';
registerLocaleData(localeId, 'id');


@Component({
  selector: 'app-bpjs',
  templateUrl: './bpjs.component.html',
  styleUrls: ['./bpjs.component.css'],
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
export class BpjsComponent implements OnInit {

  value = '';
  today : any = '';
  panelStatus : boolean = false;
  keyboard !: Keyboard;
  loading : boolean = false;
  review : boolean = false;
  jenisPasien : string = '';
  data : any = {
    rujukan: [],
    jadwal: [],
    kontrol: [],
    poli: [],
    sep: []
  }
  selected : any = {
    suratKontrol: {},
    rujukan: {},
    sep: {},
    pasien: {}
  }
  peserta = this.fb.group({
    nama: [null],
    tglLahir: [null],
    usia: [null],
    jnsKelamin: [null],
    alamat: [null],
    noKartu: [null],
    nik: [null],
    jnsPeserta: [null],
    ppkAsal: [null],
    statusPeserta: [null]
  })
  noRujukan: string = '';
  kodeBooking: string = '';

  @ViewChild('search', {static: false}) searchElement!: ElementRef;

  getPeserta(){
    if( this.value ){
      this.registrasiService.checkIsRegistered(this.value).subscribe(res => {
        if( res.code == 201 ){
          this.messageService.add({key: 'c', severity:'error', summary: 'Perhatian', detail: 'Anda Sudah Mendaftar Hari Ini.'});
        }else{
          this.getPesertaBpjs();
        }
      })
    }
  }

  getPesertaBpjs(){
    this.loading = true;
    this.registrasiService.getPesertaBPJS(this.value).subscribe(data => {
      if( data.metaData.code == 200 ){
        if( !data.response ){
          this.messageService.add({key: 'c', severity:'error', summary: 'Perhatian', detail: 'Terjadi Kendala Teknis. Silahkan Coba Kembali.'});
          this.loading = false;
          return
        }

        let res = data.response.peserta;
        this.peserta.patchValue({
          nama: res.nama,
          tglLahir: res.tglLahir,
          usia: res.umur.umurSekarang,
          jnsKelamin: res.sex,
          alamat: '',
          noKartu: res.noKartu,
          nik: res.nik,
          jnsPeserta: res.jenisPeserta.keterangan,
          ppkAsal: res.provUmum.nmProvider,
          statusPeserta: res.statusPeserta.keterangan
        });
        this.registrasiService.getDataPasien(this.value).subscribe(res => {
          if( res.data.norekmed ){
            this.selected.pasien = res.data;
          }
        })
      }else{
        this.messageService.add({key: 'c', severity:'error', summary: 'Perhatian', detail: data.metaData.message});
        this.loading = false;
      }
      this.loading = false;
    })
  }

  getPoli(){
    this.registrasiService.getPoliBpjs().subscribe(data => {
      this.data.poli = data;
    })
  }

  getJadwal(idPoli:string){
    this.loading = true;
    this.data.jadwal = [];
    let data = {
      poli: idPoli
    }
    this.registrasiService.getJadwalDokter(data).subscribe(data => {
      if( data.metadata.code == 200 && data.response ){
        this.data.jadwal = data.response;
      }else{
        this.messageService.add({key: 'c', severity:'error', summary: 'Perhatian', detail: 'Tidak ada jadwal dokter hari ini.'});
      }
      this.loading = false;
    })
  }

  getDataRujukan(){
    this.loading = true;
    this.data.rujukan = [];
    this.registrasiService.getDataRujukan(this.peserta.value.noKartu).subscribe(data => {
      if( data.metaData.code == 200 ){
        this.data.rujukan = data.response.rujukan;
      }else{
        this.messageService.add({key: 'c', severity:'error', summary: 'Perhatian', detail: data.metaData.message});
        this.loading = false;
      }
      this.loading = false;
    })
  }

  getDataSuratKontrol(){
    this.loading = true;
    this.data.rujukan = [];
    this.registrasiService.getDataKontrolByPeserta(this.value).subscribe(data => {
      if( data.metaData.code == 200 ){
        if( data.response ){
          let res = data.response.list;
          res.forEach((element: { noKartu: string; }) => {
            if( element.noKartu == this.value ){
              this.data.kontrol.push(element)
            }
          });
        }
      }else{
        this.messageService.add({key: 'c', severity:'error', summary: 'Perhatian', detail: data.metaData.message});
        this.loading = false;
      }
      this.loading = false;
    })
  }

  setJenisPasien(type:string){
    this.jenisPasien = type;
    if( type != '' ){
      this.buildKeyboard();
    }
  }

  setJadwal(data:any){
    this.selected.jadwal = data;
    this.review = true;
  }

  setJenisKunjungan(){
    if( this.jenisPasien == 'kontrol' )
      this.getDataHistory();
    else if( this.jenisPasien == 'rujukan' )
      this.getDataRujukan();
  }

  setDataRujukan(data:any){
    this.selected.rujukan = data.noKunjungan;
    this.selected.poli = data.poliRujukan;
    this.getJadwal(data.poliRujukan.kode);
  }

  setHistory(dataSep: any){
    // this.getSep(dataSep.noSep);

    // this.registrasiService.getRujukan(dataSep.noRujukan).subscribe(data => {
    //   this.selected.rujukan = data.response;
    // })

    // this.registrasiService.getDataKontrolByPeserta(this.value).subscribe(data => {
    //   if( data.response ){
    //     data.response.list.forEach((element: any) => {
    //       if( element.noSepAsalKontrol == dataSep.noSep ){
    //         this.selected.suratKontrol = element;
    //       }
    //     });
    //   }
    // })
    let poli = dataSep.poli.split(" ");
    this.registrasiService.getPoli(poli[0]).subscribe(data => {
      data.response.poli.forEach((element: any) => {
        if( element.nama == dataSep.poli ){
          this.selected.poli = element;
        }
      });
      this.getJadwal(this.selected.poli.kode);
    })
  }

  getSep(noSep:string){
    this.registrasiService.getSep(noSep).subscribe(data => {
      this.selected.sep = data.response;
    })
  }

  reformatDate(a:string){
    let b : any = formatDate(a, 'EEEE, dd MMM YYYY', 'id-ID');
    return b;
  }

  getDataHistory(){
    this.registrasiService.getHistorySep(this.peserta.value.noKartu).subscribe(data => {
      this.data.sep = data.response.histori;
    })
  }

  setNewKontrol(){
    this.registrasiService.getHistorySep(this.peserta.value.noKartu).subscribe(data => {
      this.data.sep = data.response.histori;
    })
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

  initOnShow() {
    this.peserta.reset();
    this.jenisPasien = '';
    this.value = '';
    this.data = {
      rujukan : [],
      jadwal : [],
      kontrol: [],
      sep: [],
    }
    this.review = false;
    this.kodeBooking = '';
  }

  onBlur() {
    this.searchElement.nativeElement.focus();
  }

  destroyKeyboard(){
    if( this.keyboard ){
      this.keyboard.destroy();
    }
  }

  onChange = (input: string) => {
    this.value = input;
  };

  onKeyPress = (button: string) => {
    /**
     * If you want to handle the shift and caps lock buttons
     */
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

  listenKey(e:any){
    if( e.keyCode == 13 )
      this.getPeserta();
  }

  setPanelStatus(type:string, status:boolean){
    this.anjunganservice.panel.bpjs.next(status);
  }

  save(){
    this.loading = true;
    let registrasi = {
      jnsPasien: 'jkn',
      isPasienBaru: '0',
      jnsKunjungan: (this.jenisPasien == 'rujukan') ? '1' : '3',
      rujukan: this.selected.rujukan,
      suratKontrol: this.selected.suratKontrol,
    };
    this.selected.registrasi = registrasi;
    this.selected.tanggalKunjungan = this.today;
    this.selected.selectedPoli = this.selected.poli;
    this.selected.peserta = this.peserta.value;

    let data = {
      dokter: {jadwal: this.selected.jadwal.jadwal, kodedokter: this.selected.jadwal.kodedokter, namadokter: this.selected.jadwal.namadokter},
      registrasi: { jnsKunjungan: '2', jnsPasien: 'jkn', rujukan: '', suratKontrol: '' },
      pasien: { noKartu: this.selected.peserta.noKartu, nik: this.selected.peserta.nik, hp: this.selected.pasien.tlp, norm: this.selected.pasien.norekmed.substr(-6,6), nama: this.selected.peserta.nama },
      selectedPoli: this.selected.selectedPoli,
      tanggalKunjungan: this.today,
      isPasienBaru: 0
    }

    this.registrasiService.saveAntrol( data ).subscribe(res => {
      if( res.code == 200 ){
        this.kodeBooking = res.data.kodebooking;
        this.antrianService.updateWaktuAntrian( { taskid: 3, kodebooking: res.data.kodebooking } );
      }else{
        this.messageService.add({key: 'c', severity:'error', summary: 'Perhatian', detail: res.message});
      }
      this.loading = false;
    })
  }

  constructor(
    private registrasiService: RegistrasiService,
    private messageService: MessageService,
    private errorService: ErrorService,
    private anjunganservice: AnjunganService,
    private antrianService: AntrianService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.errorService.getErrorStatus().subscribe(err => {
      if( err ){
        this.loading = false;
      }
    })

    this.anjunganservice.getPanelStatusBpjs().subscribe(status => {
      this.panelStatus = status;
    })

    this.registrasiService.getToday().subscribe(data=>{
      this.today = new Date(data.date).toISOString().split('T')[0];
    });

  }

}
