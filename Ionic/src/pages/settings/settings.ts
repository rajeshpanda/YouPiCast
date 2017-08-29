import { Component } from '@angular/core';
import { Platform, NavController, ToastController } from 'ionic-angular';
import { IpPage } from '../ip/ip.page';
import { HistoryPage } from '../history/history.page';
import { PiService } from '../services/pi.service';
import { LocalStorage } from '../storage/storage';
import { HelpPage } from '../help/help.page';
@Component({
  selector: 'settings',
  templateUrl: 'settings.html',
  providers: [PiService, LocalStorage]
})
export class Settings {
  constructor(public platform: Platform, public navCtrl: NavController, public toastCtrl: ToastController, public pi: PiService, public storage: LocalStorage) {
  }

  goToIpPage() {
    var me = this;
    me.navCtrl.push(IpPage);
  }

  goToHistoryPage() {
    var me = this;
    me.navCtrl.push(HistoryPage);
  }

  goToHelpPage() {
    var me = this;
    me.navCtrl.push(HelpPage);
  }

  killOmxPlayer() {
    var me = this;
    me.storage.getAttr('raspberryIp')
      .then(result => {
        var url = "http://" + result + "/kill";
        me.pi.sendUrlToPi(url).then(res => {
          if (res)
            me.presentToast("YOUPICAST stopped playing the current video.");
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

  closeApp() {
    this.platform.exitApp();
  }

  handleError() {
    var me = this;
    me.presentToast("Some error occured. Check if Raspberry is running.");
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
}
