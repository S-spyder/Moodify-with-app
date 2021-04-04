import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  imagePath;
  url;
  constructor(private api: ApiService, private alertCtrl: AlertController, private router: Router) { }

  async presentAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  onSubmit(form: NgForm) {
    const file = this.imagePath.item(0)
    const formData = new FormData();
    formData.append('file', file, file.name)
    this.api.onGetSongs(formData).subscribe(res => {
      if (res.mood === 'Could not process Image' || res.mood === 'Face Not Found') {
        this.presentAlert(res.mood)
      } else {
        this.api.onSetSongs(res)
        this.router.navigate(['/songs'])
      }
    })

  }

  onFileChanged(event) {
    const files = event.target.files;
    if (files.length === 0)
      return;

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }

}
