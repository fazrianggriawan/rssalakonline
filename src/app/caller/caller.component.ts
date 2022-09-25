import { Component, OnInit } from '@angular/core';
import { RegistrasiService } from '../services/registrasi.service';
import { AntrianService } from '../shared/services/antrian.service';
import { JadwalDokterService } from '../shared/services/jadwal-dokter.service';
import { LoadingService } from '../shared/services/loading.service';
import { MasterService } from '../shared/services/master.service';

@Component({
    selector: 'app-caller',
    templateUrl: './caller.component.html',
    styleUrls: ['./caller.component.css']
})
export class CallerComponent implements OnInit {

    public dataAntrian: any[] = [];
    public dataPoli: any[] = [];
    public dataJadwalPraktek: any[] = [];
    selectedPoli: any = {};
    selectedJadwal: any = {};
    nextCall: string = '';
    dataNextCall: any = {};
    lastCall: any = {};
    dataCalled: any = [];

    constructor(
        private antrianService: AntrianService,
        private registrasiService: RegistrasiService,
        private masterService: MasterService,
        private jadwalDokterService: JadwalDokterService
    ) { }

    ngOnInit(): void {
        // this.antrianService.getPoliBpjs();
        // this.antrianService.dataPoli.subscribe(res => { this.dataPoli = res });
        // this.registrasiService.jadwalDokter.subscribe(res => { this.dataJadwalPraktek = res; })
        this.antrianService.getDataAntrian().subscribe(data => this.dataAntrian = data);
        this.masterService.getPoliBpjs().subscribe(data => this.dataPoli =  data);
        this.jadwalDokterService.getDataJadwalDokter().subscribe(data => this.dataJadwalPraktek = data);
        this.masterService.getAllPoliBpjs();
    }

    public getAntrian() {
        let data = {
            poli: this.selectedPoli,
            jadwal: this.selectedJadwal
        }
        this.antrianService.filterAntrian(data);

        return false;

        //this.antrianService.getAntrian(data);

        this.antrianService.dataAntrian.subscribe(data => {
            this.dataAntrian = [];
            this.dataCalled = [];
            this.lastCall = {};
            this.nextCall = '';

            if (data.length > 0) {
                let dataAntrian: any[] = data;
                let lastIdxCalled: any = '';
                dataAntrian.forEach((element, index) => {
                    if (element.call_time) {
                        this.dataCalled.push(element);
                        lastIdxCalled = index;
                    } else {
                        this.dataAntrian.push(element);
                    }
                });

                if (this.dataCalled[lastIdxCalled]) {
                    this.lastCall = this.dataCalled[lastIdxCalled];
                }

                if (this.dataAntrian[0]) {
                    this.nextCall = this.dataAntrian[0].prefix_antrian + '-' + this.dataAntrian[0].no_antrian;
                    this.dataNextCall = this.dataAntrian[0];
                }
            }
        })
    }

    public getJadwalDokter() {
        if (this.selectedPoli){
            console.log('hallo')
            this.jadwalDokterService.cariJadwalDokter(this.selectedPoli);
            this.antrianService.dataAntrian.next('');
        }
    }

    callNext() {
        if (this.nextCall == '') {
            alert('Tidak ada data dalam antrian');
        } else {
            if (confirm('Yakin ingin memanggil ?')) {
                this.caller(this.dataAntrian[0]);

                let data = {
                    id_antrian: this.dataAntrian[0].id,
                    kodebooking: this.dataAntrian[0].booking_code
                };

                // this.antrianService.callAntrian(data).subscribe(data => {
                //     if (data.code == '200') {
                //         this.antrianService.updateWaktuAntrian({ taskid: 4, kodebooking: this.dataAntrian[0].booking_code })
                //         this.getAntrian();
                //     }
                // })
            }
        }
    }

    canceled() {
        if (confirm('Yakin antrian ini tidak hadir ?')) {
            // this.antrianService.cancelAntrian();
        }
    }

    caller(dataAntrian: any) {
        let s = this.antrianService.terbilang(dataAntrian.no_antrian).trim();
        let as = s.split(' ');

        let letPrefix = dataAntrian.prefix_antrian.substring(0, 1);
        let noPrefix = this.antrianService.terbilang(dataAntrian.prefix_antrian.substring(1, 2)).trim();

        let array: HTMLAudioElement[] = [];
        array.push(new Audio("./assets/audio/nomor_antrian.mp3"));

        array.push(new Audio("./assets/audio/" + letPrefix.toLowerCase() + ".mp3"));
        array.push(new Audio("./assets/audio/" + noPrefix + ".mp3"));


        as.forEach((element: string) => {
            array.push(new Audio("./assets/audio/" + element + ".mp3"));
        });
        array.push(new Audio("./assets/audio/silahkan.mp3"));

        array.push(new Audio("./assets/audio/poli_anak.mp3"));
        this.play_sound_queue(array);
    }

    recall() {
        this.caller(this.lastCall);
    }

    play(audio: any, callback: any) {
        audio.play();
        if (callback) {
            //When the audio object completes it's playback, call the callback
            //provided
            audio.addEventListener('ended', callback);
        }
    }

    //Changed the name to better reflect the functionality
    play_sound_queue(sounds: any) {
        var index = 0;

        //Call the recursive_play for the first time
        this.recursive_play(index, sounds);
    }

    recursive_play(index: any, sounds: any) {
        //If the index is the last of the table, play the sound
        //without running a callback after
        if (index + 1 === sounds.length) {
            this.play(sounds[index], null);
        } else {
            //Else, play the sound, and when the playing is complete
            //increment index by one and play the sound in the
            //indexth position of the array
            this.play(sounds[index], () => {
                index++;
                this.recursive_play(index, sounds);
            });
        }
    }

    play_all() {
        this.play_sound_queue([new Audio("satu.mp3"), new Audio("dua.mp3"), new Audio("tiga.mp3")]);
    }

}
