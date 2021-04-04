import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SONG } from './models/song.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  base = "http://localhost:5000/"
  songs = new BehaviorSubject<SONG>(null)

  constructor(private http: HttpClient) { }

  onGetSongs(form: FormData) {
    return this.http.post<SONG>(`${this.base}`, form)
  }

  onSetSongs(s: SONG) {
    this.songs.next(s)
  }
}
