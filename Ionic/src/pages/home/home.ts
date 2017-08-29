import { Component } from '@angular/core';
import { NavController, Platform, ToastController, AlertController } from 'ionic-angular';
import { LocalStorage } from '../storage/storage';
import { PiService } from '../services/pi.service';
import { VideoData } from '../storage/video.data'
import { Settings } from '../settings/settings'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [LocalStorage, PiService]
})
export class HomePage {
  videoTitle: string;
  raspberryIp: string;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public toastCtrl: ToastController, public platform: Platform, public storage: LocalStorage, public pi: PiService) {
    this.platform.ready().then(() => {
      
      this.registerBroadcastReceiver();
    });
  }

  private registerBroadcastReceiver() {
    var me = this;
    (<any>window).plugins.intentShim.getIntent(
      function (intent) {
        //save the current data into file
        //alert(JSON.stringify(intent));
        if (!intent.extras || !intent.extras["android.intent.extra.TEXT"] || intent.extras["android.intent.extra.TEXT"].indexOf("youtu") < 4) {
          me.navCtrl.setRoot(Settings);
        }
        else {
          var videoData = new VideoData();
          var tempArray = intent.extras["android.intent.extra.TEXT"].split('/');
          videoData.VideoId = tempArray[tempArray.length - 1];
          videoData.VideoTitle = intent.extras["android.intent.extra.SUBJECT"].substring(0,35);
          videoData.IsPlayed = 0;

          me.storage.insertVideoData(videoData);
          me.storage.getAttr('raspberryIp')
            .then(result => {
              me.raspberryIp = result;
              var url = "http://" + result + "/yt/" + videoData.VideoId;
              me.pi.sendUrlToPi(url).then(res => {
                if (res){
                  me.storage.updateVideoData(videoData.VideoId, 1).then(() =>{
                    me.pi.closeApp();
                  })
                }
                  
                else {
                 me.handleError();
                }
              }).catch(err => {
               me.handleError();
              });
            })
            .catch(err => {
              me.handleError();
            });
        }
      },
      function () {
        alert('Error getting intent');
        me.pi.closeApp();
      }
    );
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

  showAlert(header, message) {
    var me = this;
    let alert = me.alertCtrl.create({
      title: header,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
