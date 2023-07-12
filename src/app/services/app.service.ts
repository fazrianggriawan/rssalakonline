import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    notification = new BehaviorSubject<any>('');
    currentRoute = new BehaviorSubject<string>('');
    loginData = new BehaviorSubject<any>('');
    logout = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    public reformatDate(date: Date) {
        let parsingTanggal = date.toLocaleDateString('id-ID').toString().split('/');
        return parsingTanggal[2].toString() + '-' + parsingTanggal[1].toString().padStart(2, '0') + '-' + parsingTanggal[0].toString().padStart(2, '0')
    }

    public reformatDateTime(date: Date) {
        let parsingTanggal = date.toLocaleDateString('id-ID').toString().split('/');
        return parsingTanggal[2].toString() + '-' + parsingTanggal[1].toString().padStart(2, '0') + '-' + parsingTanggal[0].toString().padStart(2, '0')
    }

    public dateHuman(data: string) {
        if( data ){
            let arrayTanggal = data.substr(0, 10).split('-');
            return arrayTanggal[2] + '-' + arrayTanggal[1] + '-' + arrayTanggal[0]
        }else{
            return '';
        }
    }

    public readableDate(tanggal: string){
        let arrayTanggal = tanggal.substr(0, 10).split('-');
        return arrayTanggal[2] + '-' + arrayTanggal[1] + '-' + arrayTanggal[0];
    }

    public arrayBulan(key: string){
        let obj : any = {
            ['01'] : 'Jan',
            ['02'] : 'Feb',
            ['03'] : 'Mar',
            ['04'] : 'Apr',
            ['05'] : 'Mei',
            ['06'] : 'Jun',
            ['07'] : 'Jul',
            ['08'] : 'Ags',
            ['09'] : 'Sep',
            ['10'] : 'Okt',
            ['11'] : 'Nov',
            ['12'] : 'Des',
        }
        return obj[key];
    }

    public setNotification(type: string, message: string){
        let data = {
            type: type,
            message: message
        }
        this.notification.next(data)
    }

    public setLocalStorage(key:string, value:string){
        localStorage.setItem(key, value);
    }

    public getLocalStorage(key:string){
        if( localStorage.getItem(key) ){
            let data:any = localStorage.getItem(key);
            return data;
        }
    }

    public getSessionStorage(key:string){
        if( sessionStorage.getItem(key) ){
            let data:any = sessionStorage.getItem(key);
            return  JSON.parse(data);
        }
    }

    public print(url: string) {
        let width = screen.width / 1.5;
        let center = (screen.width / 2) - (width /2);
        let iframe = '<iframe src="' + url + '" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>';
        let win: any = window.open("", "", "width="+width+",height="+screen.height+",left="+center+",top=0,toolbar=no,menubar=no,resizable=yes");
        win.document.write(iframe);
    }

    public getLoginData(){
        if( localStorage.getItem('login') ){
            let data : any = localStorage.getItem('login');
            this.loginData.next(JSON.parse(data));
        }
    }

    public doLogout(){
        this.logout.next(true);
        sessionStorage.clear();
        setTimeout(() => {
            this.router.navigateByUrl('/login');
        }, 100);
    }

    public getAge (dateString: string) {
        if( !dateString ){
            return '';
        }
        // format dateString = mm/dd/yyyy
        var now   : any = new Date();

        var yearNow     = now.getYear();
        var monthNow    = now.getMonth();
        var dateNow     = now.getDate();

        var yearDob  : any = dateString.substring(0,4);
        var monthDob : any = dateString.substring(5,7);
        var dayDob   : any = dateString.substring(8,10);


        var dob : any = new Date(yearDob, monthDob, dayDob);

        var yearDob     : any = dob.getYear();
        var monthDob    : any = dob.getMonth();
        var dateDob     : any = dob.getDate();
        var age         = {
                            years: 0,
                            months: 0,
                            days: 0
                        };
        var ageString   = "";
        var yearString  = "";
        var monthString = "";
        var dayString   = "";


        var yearAge = yearNow - yearDob;

        if (monthNow >= monthDob)
            var monthAge = monthNow - monthDob;
        else {
            yearAge--;
            var monthAge = 12 + monthNow -monthDob;
        }

        if (dateNow >= dateDob)
            var dateAge = dateNow - dateDob;
        else {
            monthAge--;
            var dateAge = 31 + dateNow - dateDob;

            if (monthAge < 0) {
              monthAge = 11;
              yearAge--;
            }
        }

        age = {
                years: yearAge,
                months: monthAge,
                days: dateAge
            };

        if ( age.years > 1 ) yearString = " tahun";
        else yearString = " tahun";
        if ( age.months> 1 ) monthString = " bulan";
        else monthString = " bulan";
        if ( age.days > 1 ) dayString = " hari";
        else dayString = " hari";


        if ( (age.years > 0) && (age.months > 0) && (age.days > 0) )
            ageString = age.years + yearString + ", " + age.months + monthString + ", " + age.days + dayString;
        else if ( (age.years == 0) && (age.months == 0) && (age.days > 0) )
            ageString = age.days + dayString;
        else if ( (age.years > 0) && (age.months == 0) && (age.days == 0) )
            ageString = age.years + yearString;
        else if ( (age.years > 0) && (age.months > 0) && (age.days == 0) )
            ageString = age.years + yearString + ", " + age.months + monthString;
        else if ( (age.years == 0) && (age.months > 0) && (age.days > 0) )
            ageString = age.months + monthString + ", " + age.days + dayString;
        else if ( (age.years > 0) && (age.months == 0) && (age.days > 0) )
            ageString = age.years + yearString + ", " + age.days + dayString;
        else if ( (age.years == 0) && (age.months > 0) && (age.days == 0) )
            ageString = age.months + monthString;
        else ageString = "0 hari";

        return ageString;

    }

    public terbilang(x:any, sen:boolean=false) {
        let res : any;
        let abil: any = [];

        if( sen == false ){
            abil = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
          }else{
            abil = ["nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
          }

        if (x < 12) {
            res = " " + abil[x];
        } else if (x < 20) {
            res = this.terbilang(x - 10) + " belas";
        } else if (x < 100) {
            res = this.terbilang(Math.floor(x/10)) + " puluh" + this.terbilang(x % 10);
        } else if (x < 200) {
            res = " seratus" + this.terbilang(x - 100);
        } else if (x < 1000) {
            res = this.terbilang(x / 100) + " ratus" + this.terbilang(x % 100);
        } else if (x < 2000) {
            res = " seribu" + this.terbilang(x - 1000);
        } else if (x < 1000000){
            res = this.terbilang(x / 1000) + " ribu" + this.terbilang(x % 1000);
        } else if (x < 1000000000) {
            res = this.terbilang(x / 1000000) + " juta" + this.terbilang(x % 1000000);
        } else if (x < 1000000000000){
            res = this.terbilang(x / 1000000000) + " milyar" + this.terbilang(x % 1000000000);
        }

        return res;
    }

    public jsonParse(jsonString: string){
        if( jsonString ){
            return JSON.parse(jsonString);
        }else{
            return jsonString;
        }
    }

    public getTime(){
        let today = new Date();
        return today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
    }

}
