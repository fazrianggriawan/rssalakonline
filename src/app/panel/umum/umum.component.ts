import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import Keyboard from "simple-keyboard";
import { AnjunganService } from 'src/app/services/anjungan.service';
import { ErrorService } from 'src/app/services/error.service';
import { RegistrasiService } from 'src/app/services/registrasi.service';

@Component({
  selector: 'app-umum',
  templateUrl: './umum.component.html',
  styleUrls: ['./umum.component.css'],
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
export class UmumComponent implements OnInit, AfterViewInit {

  value = '';
  tahun : string = '';
  bulan : any = {};
  tanggal : string = '';
  panelStatus : boolean = false;
  keyboard !: Keyboard;
  loading : boolean = false;
  jenisPasien : string = '';
  selectedTglLahir : string = '';
  data : any = {
    rujukan: [],
    jadwal: [],
    poli: [],
    tglLahir: [],
    bulan: [],
    number: [],
  }
  display : any = {
    tanggal: false,
    bulan: false,
    tahun: false
  }
  peserta = this.fb.group({
    nama: [null],
    tglLahir: [null],
    usia: [null],
    jnsKelamin: [null],
    alamat: [null],
    norm: [null],
    nik: [null],
    jnsPeserta: [null],
    ppkAsal: [null],
    statusPeserta: [null]
  })

  @ViewChild('search', {static: false}) searchElement!: ElementRef;

  getPasien(){
    let searchBy = '';
    if( this.jenisPasien == 'kartuPasien' )
      searchBy = 'norm';
    if( this.jenisPasien == 'tglLahir' ){
      searchBy = 'tglLahir';
      this.value = this.tahun+'-'+this.bulan.code+'-'+this.tanggal;
    }

    if( this.value ){
      this.loading = true;

      this.registrasiService.getPasien(this.value, searchBy).subscribe(data => {
        if( data.code == 200 ){
          let res = data.data[0];
          this.peserta.patchValue({
            nama: res.NAMA,
            tglLahir: res.TGLAHIR,
            usia: '',
            jnsKelamin: res.KELAMIN,
            alamat: res.ALAMAT1,
            norm: res.KODE,
            nik: res.NIK
          });
        }else{
          this.loading = false;
          this.messageService.add({key: 'c', severity:'error', summary: 'Perhatian', detail: data.message});
        }
        this.loading = false;
      })
    }
  }

  getPoli(){
    this.registrasiService.getPoliBpjs().subscribe(data => {
      this.data.poli = data.data;
    })
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

  getDataRujukan(){
    this.loading = true;
    this.data.rujukan = [];
    this.registrasiService.getDataRujukan(this.peserta.value.noKartu).subscribe(data => {
      if( data.metaData.code == 200 ){
        this.data.rujukan = data.response.rujukan;
        console.log(this.data.rujukan);
      }else{
        this.messageService.add({key: 'c', severity:'error', summary: 'Perhatian', detail: data.metaData.message});
        this.loading = false;
      }
      this.loading = false;
    })
  }

  setJenisPasien(type:string){
    this.jenisPasien = type;
    this.value = '';
    this.tanggal = '';
    this.bulan = '';
    this.tahun = '';
    this.peserta.reset();
    this.buildKeyboard();
    this.getTglLahir();
    this.getBulan();
    this.getNumber();
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

  ngAfterViewInit() {
    this.peserta.reset();
    this.jenisPasien = '';
    this.value = '';
    this.data = {
      rujukan : [],
      jadwal : [],
      poli : [],
      tglLahir : [],
      bulan: [],
      number: [],
    }

  }

  onBlur() {
    this.searchElement.nativeElement.focus();
  }

  destroyKeyboard(){
    this.keyboard.destroy();
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
      this.getPasien();
  }

  setPanelStatus(type:string, status:boolean){
    this.anjunganservice.panel.tunai.next(status);
  }

  keypadInput(num:any){
    this.tahun = this.tahun + num;
  }

  hapusNumber(){
    this.tahun = this.tahun.slice(0, -1)
  }

  getTglLahir(){
    this.data.tglLahir = [];
    for (let index = 1; index <= 31; index++) {
      this.data.tglLahir.push(index)
    }
  }

  getBulan(){
    this.data.bulan = [
      {code: '01', name: 'JANUARI'},
      {code: '02', name: 'FEBRUARI'},
      {code: '03', name: 'MARET'},
      {code: '04', name: 'APRIL'},
      {code: '05', name: 'MEI'},
      {code: '06', name: 'JUNI'},
      {code: '07', name: 'JULI'},
      {code: '08', name: 'AGUSTUS'},
      {code: '09', name: 'SEPTEMBER'},
      {code: '10', name: 'OKTOBER'},
      {code: '11', name: 'NOVEMBER'},
      {code: '12', name: 'DESEMBER'}
    ];
  }

  getNumber(){
    this.data.number = [];
    for (let index = 1; index <= 9; index++) {
      this.data.number.push(index);
    }
  }

  setTanggal(tanggal:string){
    this.tanggal = tanggal;
    this.display.tanggal = false;
  }

  setBulan(bulan:string){
    this.bulan = bulan;
    this.display.bulan = false;
  }

  constructor(
    private registrasiService: RegistrasiService,
    private messageService: MessageService,
    private errorService: ErrorService,
    private anjunganservice: AnjunganService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.errorService.getErrorStatus().subscribe(err => {
      if( err ){
        this.loading = false;
      }
    })

    this.anjunganservice.getPanelStatusTunai().subscribe(status => {
      this.panelStatus = status;
    })

  }

}
