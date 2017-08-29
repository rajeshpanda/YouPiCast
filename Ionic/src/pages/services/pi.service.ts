import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class PiService {
    constructor(public http: Http, public platform : Platform) {
    }

    public sendUrlToPi(url): Promise<any> {
        var me = this;
        return me.http.get(url)
            .toPromise()
            .then(result => {
                if (result) {
                    return true;
                }
                return false;
            });
    }

    public closeApp(){
        this.platform.exitApp();
    }
}