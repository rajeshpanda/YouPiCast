import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { VideoData } from '../storage/video.data';
import { Platform, AlertController } from 'ionic-angular';
@Injectable()
export class LocalStorage {
    constructor(public platform: Platform, public storage: Storage, public alertCtrl: AlertController) {
        var me = this;
        me.getAttr('raspberryIp')
            .then(result => {
                try {
                    if (result.index(':') < 0) {
                        this.storage.set("raspberrryIp", "192.168.0.115:5000");
                    }
                    else {
                        this.storage.set("raspberryIp", result);
                    }
                } catch (error) {
                    this.storage.set("raspberrryIp", "192.168.0.115:5000");
                }

            }).catch(() => {
                this.storage.set("raspberrryIp", "192.168.0.115:5000");
            })
    }

    getAttr(attr): Promise<any> {
        var me = this;
        return me.storage.get(attr).then((val) => {
            return val;
        })
    }

    setAttr(attr, val): Promise<any> {
        var me = this;
        return me.storage.set(attr, val.replace('/', ''));
    }

    getAllSavedVideoData(): Promise<any> {
        var me = this;
        let items = [];
        return me.storage.forEach((value, key) => {
            if (!isNaN(+key)) {
                items.push(value);
            }
        }).then(() => items.reverse());
    }

    insertVideoData(videoData: VideoData): Promise<any> {
        var me = this;
        return me.storage.length().then(len => {
            return me.storage.set(len.toString(), videoData);
        })
    }


    updateVideoData(videoId: string, isPlayed: number): Promise<any> {
        var me = this;
        return me.storage.forEach((value, key, index) => {
            if (value.VideoId == videoId) {
                value.IsPlayed = isPlayed;
                return me.storage.remove(key).then(() => {
                    return me.storage.set(key, value);
                })
            }
        })
    }

    deleteAllHistory(value) {
        var me = this;
        return me.storage.clear().then(() => {
            this.storage.set("raspberryIp", value);
        })
    }
}