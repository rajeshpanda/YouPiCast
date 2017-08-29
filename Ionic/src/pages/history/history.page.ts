import { Component } from '@angular/core';
import { NavController, ToastController, Platform, AlertController } from 'ionic-angular';
import { LocalStorage } from '../storage/storage';
import { PiService } from '../services/pi.service';
import { Settings } from '../settings/settings';
import { VideoData } from '../storage/video.data';
@Component({
  selector: 'history-page',
  templateUrl: 'history.page.html',
  providers: [LocalStorage, PiService]
})
export class HistoryPage {
  videos: VideoData[];
  constructor(public platform: Platform, public alertCtrl: AlertController, public navCtrl: NavController, public storage: LocalStorage, public toastCtrl: ToastController, public pi: PiService) {
  }

  ngOnInit() {
    var me = this;
    me.storage.getAllSavedVideoData().then((result) => {
      me.videos = result;
    }).catch(() => {
      me.presentToast("Try again. Some error occured");
    })
  }

  closeApp() {
    this.platform.exitApp();
  }

  play(videoData, idx) {
    var me = this;
    me.storage.getAttr('raspberryIp')
      .then(result => {
        var url = "http://" + result + "/yt/" + videoData.VideoId;
        me.pi.sendUrlToPi(url).then(res => {
          if (res) {
            me.storage.updateVideoData(videoData.VideoId, 1);
            me.videos[Number(idx)].IsPlayed = 1;
            me.presentToast("Added " + videoData.VideoTitle.substring(0, 20) + "... to YOUPICAST.");
          }
          else {
            me.presentToast("Check connection!!");
            me.videos[Number(idx)].IsPlayed = 0;
          }
        }).catch(err => {
          me.presentToast("Check connection!!");
          me.videos[Number(idx)].IsPlayed = 0;
        });
      })
      .catch(err => {
        me.handleError();
      });
  }

  handleError() {
    var me = this;
    me.presentToast("IP not found. Set correct IP.");
    me.navCtrl.setRoot(Settings);
  }
  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  deleteAllHistory() {
    var me = this;
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Do you want to delete entire history?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            me.storage.getAttr('raspberryIp')
              .then(result => {
                me.storage.deleteAllHistory(result).then(() => {
                  me.videos = [];
                })
              })
          }
        }
      ]
    });
    alert.present();
  }
}
