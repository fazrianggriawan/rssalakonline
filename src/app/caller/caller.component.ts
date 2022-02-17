import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-caller',
  templateUrl: './caller.component.html',
  styleUrls: ['./caller.component.css']
})
export class CallerComponent implements OnInit {

  caller(){
    let s : string = 'dua puluh lima';
    let as = s.split(' ');
    let array: HTMLAudioElement[] = [];
    array.push(new Audio("./assets/audio/nomor_antrian.mp3"));
    as.forEach(element => {
      array.push(new Audio("./assets/audio/"+element+".mp3"));
    });
    array.push(new Audio("./assets/audio/silahkan.mp3"));
    // array.push(new Audio("./assets/audio/tiga.mp3"));
    array.push(new Audio("./assets/audio/poli_anak.mp3"));
    this.play_sound_queue(array);
  }

  play(audio:any, callback:any) {
    audio.play();
    if (callback) {
      //When the audio object completes it's playback, call the callback
      //provided
      audio.addEventListener('ended', callback);
    }
  }

  //Changed the name to better reflect the functionality
  play_sound_queue(sounds:any) {
    var index = 0;

    //Call the recursive_play for the first time
    this.recursive_play(index, sounds);
  }

  recursive_play(index:any, sounds:any) {
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

  constructor() { }

  ngOnInit(): void {
  }

}
