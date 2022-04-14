import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import Keyboard from "simple-keyboard";
import { AnjunganService } from 'src/app/services/anjungan.service';
import { ErrorService } from 'src/app/services/error.service';
import { RegistrasiService } from 'src/app/services/registrasi.service';

@Component({
  selector: 'app-pasien-baru',
  templateUrl: './pasien-baru.component.html',
  styleUrls: ['./pasien-baru.component.css'],
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
export class PasienBaruComponent implements OnInit, AfterViewInit {

  value = "";
  panelStatus : boolean = false;
  keyboard !: Keyboard;
  loading : boolean = false;
  jenisPasien : string = '';
  data : any = {
    rujukan: [],
    jadwal: [],
    poli: []
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

  @ViewChild('search', {static: false}) searchElement!: ElementRef;

  getPeserta(){
    if( this.value ){
      this.loading = true;
      this.registrasiService.getPesertaBPJS(this.value).subscribe(data => {
        if( data.metaData.code == 200 ){
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
        }else{
          this.messageService.add({key: 'c', severity:'error', summary: 'Perhatian', detail: data.metadata.message});
          this.loading = false;
        }
        this.loading = false;
      })
    }
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
    if( type == 'bpjs' ){
      this.peserta.reset();
      this.buildKeyboard();
    }else{
      this.getPoli();
    }
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
      jadwal : []
    }

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
    this.anjunganservice.panel.pasienBaru.next(status);
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

    this.anjunganservice.getPanelStatusPasienbaru().subscribe(status => {
      this.panelStatus = status;
    })

  }

}
