import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit{
  favoriteEvents:any = [];

  ngOnInit() {
    this.getFavorite();
  }

  getFavorite(){
    let favoriteEventsStr = localStorage.getItem('favoriteEvents');  // get local storage
    if(favoriteEventsStr == null) favoriteEventsStr = '[]'
    this.favoriteEvents = JSON.parse(favoriteEventsStr)  // change from string to list
    if(this.favoriteEvents[0] == null) this.favoriteEvents.splice(0,1)
    console.log("this.favoriteEventsContentForFrontend", this.favoriteEvents)
  }

  removeFavorite(index:number){
    let deleteEvent = this.favoriteEvents[index]
    this.favoriteEvents.splice(index,1)   // delete from favorite table
    localStorage.setItem('favoriteEvents', JSON.stringify(this.favoriteEvents))
    alert("Removed from Favorites!");
    console.log("deleteEvent", deleteEvent)
  }
}
