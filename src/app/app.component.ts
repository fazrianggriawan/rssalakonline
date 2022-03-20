import { Component, OnInit } from '@angular/core';
import { ErrorService } from './services/error.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    errorMessage : any = '';

    constructor(
        private errorService: ErrorService
    ){}

    ngOnInit(): void {
        // Listen To Error Message
        this.errorService.getErrorStatus().subscribe(err => {
            if( err ){
                this.errorMessage = 'Something bad happened, please try again later. ('+JSON.stringify(err)+')';
                setTimeout(() => {
                    this.errorMessage = false;
                }, 5000);
            }
        })
    }

}

