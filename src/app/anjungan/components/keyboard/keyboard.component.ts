import { Component, OnInit } from '@angular/core';
import Keyboard from "simple-keyboard";
import { AnjunganService } from 'src/app/services/anjungan.service';
import { KeyboardService } from '../../services/keyboard.service';

@Component({
    selector: 'app-keyboard',
    templateUrl: './keyboard.component.html',
    styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent implements OnInit {

    public keyboard !: Keyboard;

    constructor(
        private anjunganService: AnjunganService,
        private keyboardService: KeyboardService
    ) { }

    ngOnInit(): void {
        this.anjunganService.getBuildKeyboard()
            .subscribe(status => {
                if (status)
                    this.buildKeyboard();
                else
                    this.destroyKeyboard();
            })
    }

    private buildKeyboard() {
        if (!this.keyboard) {
            setTimeout(() => {
                this.keyboard = new Keyboard({
                    onChange: input => this.onChange(input),
                    onKeyPress: (button: any) => this.onKeyPress(button)
                });
            }, 200);
        } else {
            this.keyboard.render();
        }

    }

    private destroyKeyboard() {
        if (this.keyboard) {
            this.keyboard.destroy();
        }
    }

    private handleShift = () => {
        let currentLayout = this.keyboard.options.layoutName;
        let shiftToggle = currentLayout === "default" ? "shift" : "default";

        this.keyboard.setOptions({
            layoutName: shiftToggle
        });
    };

    private onChange = (input: string) => {
        this.keyboardService.value.next(input);
    };

    private onKeyPress = (button: string) => {
        if (button === "{shift}" || button === "{lock}") this.handleShift();
        if( button === "{enter}" ) this.keyboardService.enterAction.next(true);
    };

}
