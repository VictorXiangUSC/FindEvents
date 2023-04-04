import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{
  private backendRootUrl = this.searchService.backendRootUrl;

  //search parameters
  searchParams: any = {
    keyword: '',
    category: '',
    distance: '',
    isHere: true,
    location: '',
  }

  //validation
  isKeywordValid:boolean = true;
  isLocationValid:boolean = true;
  isCategoryValid:boolean = true;
  @ViewChild('keywordTooltip') keywordTooltip!: any;
  @ViewChild('locationTooltip') locationTooltip!: any;
  @ViewChild('categoryTooltip') categoryTooltip!: any;

  //keyword autocomplete
  keywordControl = new FormControl();
  keywordOptions: string[] = [];

  //constructor
  constructor(public searchService:SearchService) {
   }

  ngOnInit() {
    this.keywordControl.valueChanges.subscribe(keyword => {
      this.requestAutocomplete(keyword)})
  }

  requestAutocomplete(keyword:String){
    let backendUrl = this.backendRootUrl + "/autocomplete?";
    backendUrl += "keyword=" + keyword
    fetch(backendUrl)
      .then(resAutoCompleteData => resAutoCompleteData.json())
      .then(resAutoCompleteData => {
        this.keywordOptions = []
        for(let i = 0; i < resAutoCompleteData.attractions.length; ++i){
          this.keywordOptions.push(resAutoCompleteData.attractions[i].name)
        }
      })
  }

  onClear(){
    this.searchParams.keyword= '';
    this.searchParams.category = '';
    this.searchParams.distance = '';
    this.searchParams.isHere = true
    this.searchParams.location = ''
    this.isKeywordValid = true
    this.isLocationValid = true
    this.searchService.showEvents = false
    this.searchService.showDetails = false
  }

  onSubmit() {
    //validation
    this.searchParams.keyword = this.keywordControl.value
    if(this.searchParams.keyword != null && this.searchParams.keyword !=''){
      this.isKeywordValid = true;
    }else{
      this.isKeywordValid = false;
      this.keywordTooltip.show();
    }
    if(this.searchParams.category != null && this.searchParams.category !=''){
      this.isCategoryValid = true;
    }else{
      this.isCategoryValid = false;
      this.categoryTooltip.show();
    }
    if(this.searchParams.isHere == true ||
       (this.searchParams.isHere == false && this.searchParams.location != null && this.searchParams.location != '')){
        this.isLocationValid = true;
    }else{
      this.isLocationValid = false;
      this.locationTooltip.show();
    }

    if(!this.isKeywordValid || !this.isLocationValid || !this.isCategoryValid)
      return;

    this.searchParams.keyword = this.keywordControl.value;
    this.searchService.showEvents = true;
    this.searchService.showDetails = false;
    this.searchService.emitSearchEvents(this.searchParams);
  }


  onIsHereChange(){
    if(this.searchParams.isHere == true){
      this.searchParams.location = '';
    }
  }


}
