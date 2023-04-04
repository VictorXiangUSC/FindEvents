import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  //Flags about showing components
  showEvents:boolean = false;
  showDetails = false;
  // backendRootUrl = "http://127.0.0.1:8080"
  backendRootUrl = "https://myfirstproject-377018.wl.r.appspot.com/";

  //Event Emitters
  searchEventsEmitter = new EventEmitter<any>();
  searchDetailsEmitter = new EventEmitter<any>();

  constructor() { }

  emitSearchEvents(searchParams: any) {
    console.log("start to emit seachEvents")
    this.searchEventsEmitter.emit(searchParams);
  }

  emitSearchDetails(detailedEvent: any){
    console.log("start to emit seachDetails")
    this.searchDetailsEmitter.emit(detailedEvent);
  }

}
