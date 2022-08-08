import { Component, OnInit } from '@angular/core';
import { VirtualKeyboardService } from '../virtual-keyboard.service';

@Component({
  selector: 'app-numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.css']
})
export class NumpadComponent implements OnInit {

    public value: string = '';
    public number: any = [];

    constructor(
        private keyboardService: VirtualKeyboardService
    ) { }

    ngOnInit(): void {
        this.generateNumber();
        this.keyboardService.clear.subscribe(data => {
            if(data){
                this.value = '';
                this.keyboardService.value.next('');
            }
        })
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
