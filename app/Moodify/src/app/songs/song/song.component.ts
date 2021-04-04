import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss'],
})
export class SongComponent implements OnInit, AfterViewInit {

  @Input('song') s: string
  @Input('autoplay') autoplay: boolean;
  @Output() next: EventEmitter<any> = new EventEmitter(); 
  @Output() prev: EventEmitter<any> = new EventEmitter();
  @ViewChild('audio') audio: ElementRef;
  name: string
  path
  play: boolean = false
  constructor(private api: ApiService, private sanitizer:DomSanitizer) { }

  ngOnInit() {
    this.name = this.s.split('/')[2]
    this.path = this.sanitizer.bypassSecurityTrustUrl(this.api.base + 'static/' + this.s)
  }

  ngAfterViewInit() {
    // this.audio.nativeElement.autoplay = this.autoplay
  }

  onNext() {
    this.next.emit(this)
    this.audio.nativeElement.pause()
  }

  onPrev() {
    this.prev.emit(this)
    this.audio.nativeElement.pause()
  }

  playSong() {
    this.play = true
  }

  pauseSong() {
    this.play = false
  }

  onChangeDuration() {
    if (this.audio.nativeElement.currentTime === this.audio.nativeElement.duration) {
      this.onNext()
    }
  }

}
