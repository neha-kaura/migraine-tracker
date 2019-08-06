import { Component } from '@angular/core';
import { NavController, PopoverController, NavParams } from 'ionic-angular';
import {GoalDetailsServiceProvider} from "../../../providers/goal-details-service/goal-details-service";
import {SelectSubgoalsPage} from "../select-subgoals/select-subgoals";
import {DataConfigPage} from "../data-config/data-config";
import {GlobalFunctionsServiceProvider} from "../../../providers/global-functions-service/global-functions-service";
import {DataDetailsServiceProvider} from "../../../providers/data-details-service/data-details-service";
import {EnterTextGoalPage} from "../enter-text-goal/enter-text-goal";
import {PopoverInfo} from "../popover/popover";
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

@Component({
  selector: 'page-goal-type',
  templateUrl: 'goal-type.html',
})

export class GoalTypePage {

  @ViewChild('slides') slides: Slides;

  private goalList : [{[goalDetails:string]: any;}];
  private selectedGoals : string[]= [];
  private textGoals;

  constructor(public navCtrl: NavController,
              public popoverCtrl: PopoverController,
              public navParams: NavParams,
              public goalDetailsServiceProvider: GoalDetailsServiceProvider,
              public dataDetails: DataDetailsServiceProvider,
              public globalFunctions: GlobalFunctionsServiceProvider) {
    this.selectedGoals = [];
  }

  ionViewDidLoad() {
    this.goalList = this.goalDetailsServiceProvider.getGoalList();
    for(let i=0;i<this.goalList.length; i++){
      let subgoals = this.goalDetailsServiceProvider.getSubgoalByGoalID(this.goalList[i].goalID);
      if(subgoals !== null){
        this.goalList[i].subgoalList = subgoals
      }
      for(let j=0;j<this.goalList.length; j++){
        this.goalList[j].colors = this.globalFunctions.buttonColors(false);
      }
    }
  }

  toggleGoalSelection(goal : {[goalDetails:string]: any;}){
    if (!this.selectedGoals.includes(goal.goalID)) {
      this.selectedGoals.push(goal.goalID);
    }
    else {
      const index = this.selectedGoals.indexOf(goal.goalID);
      this.selectedGoals.splice(index, 1);
    }
  }

  addGoal(goal : {[goalDetails:string]: any;}){
    if (!this.selectedGoals.includes(goal.goalID)) {
      this.selectedGoals.push(goal.goalID);
    }
    else {
      const index = this.selectedGoals.indexOf(goal.goalID);
      this.selectedGoals.splice(index, 1);
    }
    goal.colors = this.globalFunctions.buttonColors(true);
  }

  removeGoal(goal : {[goalDetails:string]: any;}) {
    const index = this.selectedGoals.indexOf(goal.goalID);
    if (index > -1) {
      this.selectedGoals.splice(index, 1);
    }
    goal.colors = this.globalFunctions.buttonColors(false);
  }

  onInfoClick() {
    console.log("I'm inside info")
    let informationPopover = this.popoverCtrl.create(PopoverInfo, {},
    {
      showBackdrop: true,
      cssClass: 'custom-info-popover'
    });
    informationPopover.present();
  }

  continueSetup() {
    this.selectedGoals.sort();
    let configStep = {"step": "goalType", "description": "Selected Goals", "added": []};
    configStep = this.globalFunctions.toggleDetails(configStep);
    let dataToSend = {
      "configPath": [configStep],
      'goalIDs': this.selectedGoals
    };
    let allSubgoals = [];
    for(let i=0; i<this.selectedGoals.length; i++){
      let subgoals = this.goalDetailsServiceProvider.getSubgoalByGoalID(this.selectedGoals[i]);
      if(subgoals !== null){
        allSubgoals.push(subgoals);
      }
    }
    dataToSend['textGoals'] = this.textGoals;

    let configData = this.dataDetails.findNextConfigData(this.selectedGoals, '');

    if(allSubgoals.length > 0){
      dataToSend['allSubgoals'] = allSubgoals;
      if (configData!== null){
        dataToSend['dataPage'] = configData;
        console.log("cont navparams", dataToSend)
        this.navCtrl.push(DataConfigPage, dataToSend);
      }
    }
    else{
      let error = new Error("All data conditional, no conditions met.");
      throw(error);
    }
  }
}
