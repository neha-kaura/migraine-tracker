import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DataDetailsServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataDetailsServiceProvider {

  private supportedFields : any;
  private listedData : {[dataType: string] : any};
  private configData : any;
  private medTrackingIDs : string[] = ['asNeededMeds', 'newAsNeededMedication'];

  constructor(public http: HttpClient) {
    this.openDataConfig();
    this.openSupportedFields();
    this.openListedData();
  }


  getDisplayName(name : string) : string{
    for(let i=0; i<this.configData.length; i++){
      if(this.configData[i].name === name){
        if(this.configData[i].toDisplay){
          return this.configData[i].toDisplay;
        }
        else{
          return name;
        }
      }
    }
  }

  openDataConfig() {
    this.http.get('assets/dataConfig.json', {},).subscribe(configData => {
        this.configData = configData;
      },
      error => {
        console.log(error);
      });
  }

  openSupportedFields() {
    this.http.get('assets/supportedFields.json', {},).subscribe(fieldList => {
        this.supportedFields = fieldList;
      },
      error => {
        console.log(error);
      });
  }

  openListedData() {
    this.http.get('assets/listedData.json', {},).subscribe(listedData => {
        this.listedData = listedData;
      },
      error => {
        console.log(error);
      });
  }

  getConfigData() : [{[dataProperty: string] : any}]{
    return this.configData;
  }


  getConfigByName(dataType: string) : {[dataTypeProps:string]:any}{
    for(let i=0; i<this.configData.length; i++){
      if(this.configData[i]['name'] === dataType){
        return this.configData[i];
      }
    }
    console.log("DATATYPE NOT IN DATA CONFIG: " + dataType);
    return null;
  }

  getWhetherGoals(dataType: string) : boolean{
    return this.getConfigByName(dataType)['dataGoals'];
  }

  getAllDataTypes() : string[]{
    let allDataTypes = [];
    for(let i=0; i<this.configData.length; i++){
      allDataTypes.push(this.configData[i].name);
    }
    return allDataTypes;
  }

  getDataList(goals) : any[]{
    let dataList = [];
    for(let i=0; i<this.configData.length; i++){
      let condGoal = this.configData[i].conditionalGoal;
      if(condGoal){
        if(goals.indexOf(condGoal) > -1){
          dataList.push(this.configData[i].name);
        }
      }
      else{
        dataList.push(this.configData[i].name);
      }
    }
    return dataList;
  }

  getSupportedFields() : [{[fieldProp : string]:any}] {
    return this.supportedFields;
  }


  getMedTrackingIDs() : string[] {
    return this.medTrackingIDs;
  }


  getWhetherTrackingMeds(treatmentsTracking: string[]) : boolean{
    if(!treatmentsTracking) return false;
    for(let i=0; i<this.medTrackingIDs.length; i++){
      if(treatmentsTracking.indexOf(this.medTrackingIDs[i]) > -1){
        return true;
      }
    }
    return false;
  }


  getWhetherRecommended(activeGoals: string[], recs: string[]){
    // based on the set of configured goals, returns whether we recommend a specific data element
    for(let i=0; i<activeGoals.length; i++){
      if(recs.indexOf(activeGoals[i]) > -1){
        return true;
      }
    }
    return false;
  }


  findNextConfigData(goalIDs, currentlyConfiguring) {
    let newDataIndex = this.configData.indexOf(currentlyConfiguring) + 1;
    for(let i = newDataIndex; i < this.configData.length; i++) {
      let dataType = this.configData[i];
      if(!(dataType.conditionalGoals)){
        return dataType;
      }
      else{
        for(let j=0; j<dataType.conditionalGoals.length; j++){ // if it has ANY of the conditional goals, show the page
          if(goalIDs.indexOf(dataType.conditionalGoals[j]) > -1){
            return dataType;
          }
        }
      }
    }
    return null;
  }


  getRecsAndCommon(alreadyTracking: string[], dataType: string,
                   goalIDs: string[]) : any[]{
    let dataOfType = this.listedData[dataType];
    let otherData = [];
    let recData = [];

    for(let i=0; i<dataOfType.length; i++){
      let dataObject = dataOfType[i];
      if (alreadyTracking.indexOf(dataObject.id) === -1){ // not already tracking it
        if(dataObject['condition']) {
          console.log("conditional");
          if(dataObject['id'] === 'frequentMedUse' || dataObject['id'] === 'whetherMedsWorked'){
            console.log("medUse");
            if(this.getWhetherTrackingMeds(alreadyTracking)){
              if(this.getWhetherRecommended(goalIDs, dataObject['recommendingGoals'])){
                recData.push(dataObject);
              }
              else{
                otherData.push(dataObject);
              }
            }
          }
          else{
            console.log("CONDITION BUT NO FUNCTION!");
          }
        }
        else if(this.getWhetherRecommended(goalIDs, dataObject['recommendingGoals'])){
          recData.push(dataObject);
        }
        else{
          otherData.push(dataObject);
        }
      }
    }

    return [recData, otherData];


  }

}
