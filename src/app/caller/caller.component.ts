import { Component, OnInit } from '@angular/core';
import { AntrianService } from '../services/antrian.service';
import { RegistrasiService } from '../services/registrasi.service';

@Component({
    selector: 'app-caller',
    templateUrl: './caller.component.html',
    styleUrls: ['./caller.component.css']
})
export class CallerComponent implements OnInit {

    dataAntrian: any[] = [];
    dataPoli: any[] = [];
    dataJadwalPraktek: any[] = [];
    tglKunjungan: Date = new Date();
    selectedPoli: any = {};
    selectedJadwal: any = {};
    nextCall: string = '';
    dataNextCall: any = {};
    lastCall: any = {};
    dataCalled: any = [];

    dataDashboard: any[] = [
        { 'prefix': 'A1', 'nama': 'ANAK' },
        { 'prefix': 'A2', 'nama': 'ANASTESI' },
        { 'prefix': 'A3', 'nama': 'BEDAH' },
        { 'prefix': 'A4', 'nama': 'BEDAH MULUT' },
        { 'prefix': 'A5', 'nama': 'BEDAH PLASTIK' },
        { 'prefix': 'A6', 'nama': 'GERIATRI' },
        { 'prefix': 'A7', 'nama': 'PENYAKIT DALAM' },
        { 'prefix': 'A8', 'nama': 'JANTUNG' },
        { 'prefix': 'A9', 'nama': 'PENYAKIT JIWA' },
        { 'prefix': 'B1', 'nama': 'KULIT KELAMIN' },
        { 'prefix': 'B1', 'nama': 'MATA' },
        { 'prefix': 'B3', 'nama': 'OBGYN' },
        { 'prefix': 'B4', 'nama': 'ORTHOPEDI' },
        { 'prefix': 'B5', 'nama': 'PARU' },
        { 'prefix': 'B6', 'nama': 'REHABILITASI MEDIK' },
        { 'prefix': 'B7', 'nama': 'SARAF' },
        { 'prefix': 'B8', 'nama': 'THT' },
        { 'prefix': 'B9', 'nama': 'UMUM' },
        { 'prefix': 'C1', 'nama': 'UROLOGI' },
    ];

    getDataPoli() {
        this.antrianService.getPoliBpjs().subscribe(data => {
            this.dataPoli = data.data;
        })
    }

    getAntrian() {
        let data = {
            tgl: this.tglKunjungan.toLocaleDateString(),
            poli: this.selectedPoli,
            jadwal: this.selectedJadwal
        }
        this.antrianService.getAntrian(data).subscribe(data => {
            this.dataAntrian = [];
            this.dataCalled = [];
            this.lastCall = {};
            this.nextCall = '';

            if (data.data.length > 0) {
                let dataAntrian: any[] = data.data;
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
                    console.log(this.lastCall);
                }

                if (this.dataAntrian[0]) {
                    this.nextCall = this.dataAntrian[0].prefix_antrian + '-' + this.dataAntrian[0].no_antrian;
                    this.dataNextCall = this.dataAntrian[0];
                }
            }
        })
    }

    getJadwalDokter() {
        if (this.selectedPoli) {
            this.selectedJadwal = {};
            let data = {
                tgl: this.tglKunjungan.toLocaleDateString(),
                poli: this.selectedPoli
            }
            this.registrasiService.getJadwalDokter(data).subscribe(data => {
                this.dataJadwalPraktek = data.response;
            })
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

                this.antrianService.callAntrian(data).subscribe(data => {
                    if (data.code == '200') {
                        this.updateWaktuAntrian(4);
                        this.getAntrian();
                    }
                })
            }
        }
    }

    updateWaktuAntrian(taskId: any) {
        let booking_code: string = '';
        if (this.dataAntrian[0]) {
            booking_code = this.dataAntrian[0].booking_code;
        } else {
            booking_code = this.lastCall.booking_code;
        }
        let data = {
            kodebooking: booking_code,
            taskid: taskId
        };
        this.antrianService.updateWaktuAntrian(data).subscribe(data => {
            console.log(data.metadata.message);
        })
    }

    canceled() {
        if (confirm('Yakin antrian ini tidak hadir ?')) {
            this.antrianService.cancelAntrian().subscribe(res => {
                console.log(res)
            })
        }
    }

    caller(dataAntrian:any) {
        let s = this.antrianService.terbilang(dataAntrian.no_antrian).trim();
        let as = s.split(' ');

        let letPrefix = dataAntrian.prefix_antrian.substring(0,1);
        let noPrefix = this.antrianService.terbilang(dataAntrian.prefix_antrian.substring(1,2)).trim();

        let array: HTMLAudioElement[] = [];
        array.push(new Audio("./assets/audio/nomor_antrian.mp3"));

        array.push(new Audio("./assets/audio/"+letPrefix.toLowerCase()+".mp3"));
        array.push(new Audio("./assets/audio/"+noPrefix+".mp3"));


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

    constructor(
        private antrianService: AntrianService,
        private registrasiService: RegistrasiService
    ) { }

    ngOnInit(): void {
        this.getDataPoli();
    }

}
