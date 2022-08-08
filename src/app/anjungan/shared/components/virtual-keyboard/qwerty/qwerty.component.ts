import { Component, OnInit } from '@angular/core';
import { VirtualKeyboardService } from '../virtual-keyboard.service';

@Component({
    selector: 'app-qwerty',
    templateUrl: './qwerty.component.html',
    styleUrls: ['./qwerty.component.css']
  })
  export class QwertyComponent implements OnInit {

    public value: string = '';
    public number: any = [];
    public qwerty1: any = [];
    public qwerty2: any = [];
    public qwerty3: any = [];

    constructor(
        private keyboardService: VirtualKeyboardService
    ) { }

    ngOnInit(): void {
        this.generateNumber();
        this.qwerty1 = ['Q','W','E','R','T','Y','U','I','O','P']
        this.qwerty2 = ['A','S','D','F','G','H','J','K','L']
        this.qwerty3 = ['Z','X','C','V','B','N','M']
    }

    public keypadInput(num: string) {
        this.value = this.value + num;
        this.keyboardService.value.next(this.value);
    }

    public hapusNumber() {
        this.value = this.value.slice(0, -1)
        this.keyboardService.value.next(this.value);
    }

    public generateNumber() {
        this.number = [];
        for (let index = 1; index <= 9; index++) {
            this.number.push(index);
        }
    }

    public ok() {
        this.keyboardService.enterAction.next(true);
    }

}