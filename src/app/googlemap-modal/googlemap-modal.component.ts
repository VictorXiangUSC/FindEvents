import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-googlemap-modal',
  templateUrl: './googlemap-modal.component.html',
  styleUrls: ['./googlemap-modal.component.css']
})
export class GooglemapModalComponent implements OnInit{
  @Input() public mapOptions: google.maps.MapOptions = {
    center: { lat: 0, lng: 0},
    zoom : 14
  };
  @Input() public marker = {
    position: { lat: 0, lng: 0 }
  };

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {  }
}
