import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../api.service';
import { SONG } from '../models/song.model';
import { IonSlides} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
})
export class SongsPage implements OnInit, OnDestroy {

  @ViewChild('slides')  slides: IonSlides;
  songSub: Subscription
  songs: SONG
  slideOpts = {
    initialSlide: 0,
    loop: true
  };
  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.songSub = this.api.songs.subscribe(d => {
      this.songs = d
      if (!d) {
        this.router.navigate(['/'])
      }
    })
  }

  next(e){
    this.slides.slideNext();
    e.audio.nativeElement.pause()
    e.audio.nativeElement.currentTime = 0
  }

  prev(e){
    this.slides.slidePrev();
    e.audio.nativeElement.pause()
    e.audio.nativeElement.currentTime = 0
  }

  ngOnDestroy() {
    this.songSub.unsubscribe()
  }

}
