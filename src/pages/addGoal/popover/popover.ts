import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

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
  private popoverHeading : string = "";
  private popoverContent : [string | string[]] = [];
  private popoverExamples : [string | string[]] = [];

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams){
    const popoverData = this.navParams.data.opts.componentProps ? this.navParams.data.opts.componentProps: [];
    this.popoverHeading = popoverData.popoverHeading ? popoverData.popoverHeading : "";
    this.popoverContent = popoverData.popoverContent ? popoverData.popoverContent : [];
    this.popoverExamples = popoverData.popoverExamples ? popoverData.popoverExamples : [];
  }

  onPopupClose() {
    this.viewCtrl.dismiss();
  }
}
