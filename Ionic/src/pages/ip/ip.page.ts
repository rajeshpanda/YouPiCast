import { Component } from '@angular/core';
import { Platform, NavController, ToastController } from 'ionic-angular';
import { LocalStorage } from '../storage/storage';
@Component({
  selector: 'ip-page',
  templateUrl: 'ip.page.html',
  providers: [LocalStorage]
})
export class IpPage {
  public raspberryIp: string;
  constructor(public platform: Platform, public navCtrl: NavController, public storage: LocalStorage, public toastCtrl: ToastController) {
  }

  ngOnInit() {
    var me = this;
    me.storage.getAttr('raspberryIp')
      .then(result => {
        me.raspberryIp = result;
      })
      .catch(err => {
          me.presentToast("IP not found. Set correct IP.");
      });
  }

  saveValues() {
    var me = this;
    //save the values
    me.storage.setAttr("raspberryIp", me.raspberryIp).then(()=>{
        me.presentToast("IP saved.");
    });
  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  closeApp(){
    this.platform.exitApp();
  }
}
