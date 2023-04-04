import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {  compareDates } from 'src/app/utils';
import { SearchService } from '../search.service';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnDestroy{
  // keys
  private ipinfoToken = "53c6306af35386";
  private geoApikey = "AIzaSyCRAymY9gtY_P90DTZOEbc_TxVZVzGqQE8";
  private backendRootUrl = this.searchService.backendRootUrl;

  //Search Events
  events:any = [];
  //Flags about empty events
  emptyEvents:boolean = false;
  subscription: Subscription;

  //constructor
  constructor(public searchService:SearchService) {
    this.subscription = this.searchService.searchEventsEmitter.subscribe(searchParams => {
      this.requestLatLngBeforeEvents(searchParams)
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  requestLatLngBeforeEvents(searchParams: any){
    this.events = []
    let requestEventsUrl = this.backendRootUrl + "/events?"

    if(searchParams.distance == ''){
      searchParams.distance = "10"
    }
    requestEventsUrl += "keyword=" + searchParams.keyword;
    requestEventsUrl += "&category=" + searchParams.category;
    requestEventsUrl += "&distance=" + searchParams.distance;
    requestEventsUrl += "&location=" + searchParams.location;
    if(searchParams.isHere){
      let ipUrl = `https://ipinfo.io/?token=${this.ipinfoToken}`;
      fetch(ipUrl)
      .then(response => response.json())
      .then(resIpData => {
        requestEventsUrl += `&latitude=${resIpData["loc"].split(",")[0]}`;
        requestEventsUrl += `&longitude=${resIpData["loc"].split(",")[1]}`;
        this.requestEvents(requestEventsUrl);
      });
    }
    else{
      let googleGeoApiBaseUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=${this.geoApikey}&address=${searchParams.location}`;
      fetch(googleGeoApiBaseUrl)
      .then(response => response.json())
      .then(resGeoData => {
        requestEventsUrl += `&latitude=${resGeoData["results"][0]["geometry"]["location"]["lat"]}`;
        requestEventsUrl += `&longitude=${resGeoData["results"][0]["geometry"]["location"]["lng"]}`;
        this.requestEvents(requestEventsUrl);
      })
    }
  }

  requestEvents(requestEventsUrl: string){
    this.events = [];
    fetch(requestEventsUrl)
    .then(response => response.json())
    .then(resEventsData => {
      if(resEventsData.page.totalElements == 0){
        this.emptyEvents = true
      }
      else{
        let resEvents = resEventsData._embedded.events.sort(compareDates)
        for(let i = 0; i < resEvents.length; i++){
          this.events.push(resEvents[i]);
        }
      }
    })
  }

  onSearchDetails(detailedEvent: any){
    this.searchService.showEvents = false
    this.searchService.showDetails = true
    this.searchService.emitSearchDetails(detailedEvent);
  }

}
