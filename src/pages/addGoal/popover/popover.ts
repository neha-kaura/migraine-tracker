import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the EnterTextGoalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'popover',
  templateUrl: 'popover.html',
})

export class PopoverInfo {
  constructor(public viewCtrl: ViewController){}

  onPopupClose() {
    this.viewCtrl.dismiss();
  }
}
