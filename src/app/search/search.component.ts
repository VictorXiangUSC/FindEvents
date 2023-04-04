import { Component} from '@angular/core';
import { SearchService } from './search.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [SearchService]
})
export class SearchComponent{

  //constructor
  constructor(public searchService:SearchService) { }
}
