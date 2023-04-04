import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { GooglemapModalComponent } from 'src/app/googlemap-modal/googlemap-modal.component';
import { getProperty } from 'src/app/utils';
import { SearchService } from '../search.service';



@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  private backendRootUrl = this.searchService.backendRootUrl;

  //nav bar
  navChosen = 1;

  //Details: Events
  detailedEvent: any
  isDetailedEventFavorite: boolean = false;
  details = {
    name: '',
    date: '',
    isMusicRelated: true,
    artistTeamStr: '',
    artistTeams: [''],
    venue: '',
    genres: '',
    priceRange: '',
    ticketStatus: '',
    statusColor: 'green',
    buyTicketUrl: '',
    seatMapUrl: ''
  }

  //Details: Artists
  artistsDetails:any = [];
  spotifyArtistDetails:any;
  spotifyAlbumsDetails:any;

  //Details: Venues
   venueDetails = {
    address: '',
    city: '',
    phoneNumber: '',
    openHours: '',
    generalRule: '',
    childRule: ''
  }
  showFullOpenHoursText = false;
  showFullGeneralRuleText = false;
  showFullChildRuleText = false;

  //Google Map Modal
  mapOptions: google.maps.MapOptions = {
    center: { lat: 0, lng: 0},
    zoom : 14
  }
  marker = {
      position: { lat: 0, lng: 0 }
  }

  //Social Media Api
  facebookUrl = "https://www.facebook.com/sharer/sharer.php?u="
  twitterUrl = "https://twitter.com/intent/tweet?text=";


  // Favorite
  favoriteEvents:any = [];

  subscription: Subscription;

  //constructor
  constructor(public searchService:SearchService, public modalService: NgbModal) {
    this.subscription = this.searchService.searchDetailsEmitter.subscribe(detailedEvent => {
      this.searchDetails(detailedEvent);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  searchDetails(detailedEvent: any){
    this.detailedEvent = detailedEvent

    let favoriteEventsStr = localStorage.getItem('favoriteEvents');
    if(favoriteEventsStr == null) favoriteEventsStr = '[]';
    this.favoriteEvents = JSON.parse(favoriteEventsStr);

    //check if is favorite event
    this.isDetailedEventFavorite = false;
    for(let i = 0; i < this.favoriteEvents.length; i++){
      let curFavoriteEvent = this.favoriteEvents[i];
      if(getProperty(curFavoriteEvent, "name") == getProperty(this.detailedEvent, "name") &&
      getProperty(curFavoriteEvent, "name", "_embedded", "venues") == getProperty(this.detailedEvent, "name", "_embedded", "venues") &&
      getProperty(curFavoriteEvent, "dateTime", "dates", "start") == getProperty(this.detailedEvent, "dateTime", "dates", "start")
      ){
        this.isDetailedEventFavorite = true;
        break;
      }
    }

    //get details property values
    this.details.name = getProperty(this.detailedEvent, "name");

    this.details.date = getProperty(this.detailedEvent, "localDate", "dates", "start") + " "
    + getProperty(this.detailedEvent, "localTime", "dates", "start");

    this.details.artistTeamStr = '';
    this.details.artistTeams = [];
    let attractions =  getProperty(this.detailedEvent, "attractions", "_embedded");
    for(let i = 0; i < attractions.length; i++){
      this.details.artistTeamStr += attractions[i].name;
      this.details.artistTeams.push(attractions[i].name);
      if(i < attractions.length - 1) this.details.artistTeamStr += ' | ';
    }

    this.details.venue = getProperty(this.detailedEvent, "name", "_embedded","venues");

    this.details.genres = ''
    let categories = ["segment", "genre", "subGenre", "type", "subType"];
    let classifications = getProperty(this.detailedEvent, "classifications");
    if(classifications != ""){
        for(let category of categories){
            let val = getProperty(classifications, "name", category);
            if(val != "Undefined" && val != "") this.details.genres += val + " | ";
        }
    }
    if(this.details.genres.length > 3)
      this.details.genres = this.details.genres.substring(0, this.details.genres.length - 3);
    this.detailedEvent.genres = this.details.genres

    this.details.priceRange = "";
    let ranges = getProperty(this.detailedEvent, "priceRanges");
    if(ranges != "")
      this.details.priceRange = getProperty(ranges, "min") + "-" + getProperty(ranges, "max");

    this.details.ticketStatus = getProperty(this.detailedEvent, "code", "dates", "status");
    let status: string = this.details.ticketStatus;
    let saleStatucColor:{[key:string]:string} = {"onsale": "green", "offsale": "red", "cancelled": "black",
    "postponed": "orange", "rescheduled": "orange"};
    if(this.details.ticketStatus in saleStatucColor){
      this.details.statusColor = saleStatucColor[status];
    }

    this.details.buyTicketUrl = getProperty(this.detailedEvent, "url");
    this.details.seatMapUrl = getProperty(this.detailedEvent, "staticUrl", "seatmap");

    // Social Media
    this.facebookUrl += this.details.buyTicketUrl;
    this.twitterUrl += "Check out " + this.details.name + " at " + this.details.buyTicketUrl;

    //google map
    this.mapOptions = {
      center: { lat: parseFloat(getProperty(this.detailedEvent, "latitude", "_embedded","venues","location")),
                lng: parseFloat(getProperty(this.detailedEvent, "longitude", "_embedded","venues","location"))},
      zoom : 14
    }
    this.marker = {
        position: {lat: parseFloat(getProperty(this.detailedEvent, "latitude", "_embedded","venues","location")),
                    lng: parseFloat(getProperty(this.detailedEvent, "longitude", "_embedded","venues","location"))}

    }

    //request Venue if necessary
    if(this.details.venue != ''){
      let requestVenueUrl = `${this.backendRootUrl}/venueDetail?keyword=${this.details.venue}`
      this.requestVenue(requestVenueUrl);
    }

    //request Artists if necessary
    this.details.isMusicRelated = this.details.genres.indexOf('Music') != -1 ? true : false;
    this.artistsDetails = []
    if(this.details.artistTeams.length != 0 && this.details.isMusicRelated){
      let requestArtistUrl = `${this.backendRootUrl}/artist?`;
      for(let i = 0; i < this.details.artistTeams.length; i++){
        requestArtistUrl += "artist=" + this.details.artistTeams[i];
        this.requestArtist(requestArtistUrl, this.details.artistTeams[i]);
      }
    }
  }

  requestVenue(requestVenueUrl:string){
    fetch(requestVenueUrl)
    .then(response => response.json())
    .then(resVenueData => {
      let venues = getProperty(resVenueData, "venues");
      if(venues.length > 0){
        for(let i = 0; i < venues.length; i++){
          let curVenue = venues[i];
          if(curVenue.name === this.details.venue){
            this.venueDetails.address =  getProperty(curVenue, "line1", "address");
            this.venueDetails.city =  getProperty(curVenue, "name", "city") + ', ' + getProperty(curVenue, "stateCode", "state");
            this.venueDetails.phoneNumber = getProperty(curVenue, "phoneNumberDetail", "boxOfficeInfo");
            this.venueDetails.openHours = getProperty(curVenue, "openHoursDetail", "boxOfficeInfo");
            this.venueDetails.generalRule = getProperty(curVenue, "generalRule", "generalInfo");
            this.venueDetails.childRule = getProperty(curVenue, "childRule", "generalInfo");
            break;
          }
        }
      }
    })
  }

  requestArtist(requestArtistUrl: string, artistName: string){
    fetch(requestArtistUrl)
    .then(response => response.json())
    .then(resArtistDetails => {
      this.spotifyArtistDetails = resArtistDetails;
      let items = getProperty(this.spotifyArtistDetails, "items", "artists");
      let curItem:any;
      let isMatch = false
      for(let i = 0; i < items.length; i++){
        curItem = items[i];
        if(curItem.name === artistName){
          isMatch = true;
          break;
        }
      }
      if(isMatch){
        let requestAlbumsUrl = `${this.backendRootUrl}/albums?artistId=${curItem.id}`;
        fetch(requestAlbumsUrl)
        .then(response => response.json())
        .then(resAlbumsDetails => {
          this.spotifyAlbumsDetails = resAlbumsDetails;
          let albumItems = getProperty(this.spotifyAlbumsDetails, "items");
          let albumUrlList = [];
          for(let j = 0; j < albumItems.length; j++){
            albumUrlList.push(getProperty(albumItems[j], "url", "images"));
          }
          this.artistsDetails.push({name:curItem.name,
                                    photoUrl:curItem.images[0].url,
                                    followers: curItem.followers.total,
                                    popularity: curItem.popularity,
                                    spotifyLink: curItem.external_urls.spotify,
                                    albumUrls: albumUrlList});
        })
      }
    })
  }

  toggleFavorite(){
    let favoriteEventsStr = localStorage.getItem('favoriteEvents');  // get local storage
    if(favoriteEventsStr == null) favoriteEventsStr = '[]'
    this.favoriteEvents = JSON.parse(favoriteEventsStr);  // change from string to list
    if(this.isDetailedEventFavorite){
      for(let i = 0; i < this.favoriteEvents.length; i++){
        if(this.favoriteEvents[i].name == this.detailedEvent.name &&
          this.favoriteEvents[i]._embedded.venues[0].name == this.detailedEvent._embedded.venues[0].name
          && this.favoriteEvents[i].dates.start.dateTime == this.detailedEvent.dates.start.dateTime){
          this.favoriteEvents.splice(i,1);
          break;
        }
      }
    }
    else {
      this.favoriteEvents.push(this.detailedEvent);
    }
    this.isDetailedEventFavorite = !this.isDetailedEventFavorite;
    localStorage.setItem('favoriteEvents', JSON.stringify(this.favoriteEvents))
  }

  goBack(){
    this.searchService.showDetails = false
    this.searchService.showEvents = true
  }

  openModal() {
    const modalRef = this.modalService.open(GooglemapModalComponent);
    modalRef.componentInstance.mapOptions = this.mapOptions;
    modalRef.componentInstance.marker = this.marker;
  }


}
