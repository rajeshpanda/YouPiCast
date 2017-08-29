import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
@Component({
  selector: 'help-page',
  templateUrl: 'help.page.html'
})
export class HelpPage {
  constructor(public platform: Platform) {
  }

  closeApp() {
    this.platform.exitApp();
  }
}
