import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from 'src/app/shared/services/search.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  PhotosRootModel,
  Photo,
  Photos,
  SearchFilterModel,
} from 'src/app/shared/model';
import { SelectItem } from 'primeng/api';
import { CoreService } from '../core.service';

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.component.html',
})
export class ImageSearchComponent implements OnInit, OnDestroy {
  protected destroyActions = new Subject<boolean>();

  photos = new Photos();
  photosFromUser = new Photos();
  isLoading = false;
  imagesPerPage = 50;
  pageNumber = 1;
  activeIndex : number = 0;
  searchText!: string;
  safe_search = 1;
  searchFilterModel = new SearchFilterModel();
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
  displayPreview = false;
  constructor(
    public searchService: SearchService,
    private coreService: CoreService
  ) {}

  ngOnInit(): void {
    this.coreService
      .getSearchValue()
      .pipe(takeUntil(this.destroyActions))
      .subscribe((text: string) => {
        this.searchText = text;
        this.search();
      });
  }

  filter(searchFilter: SearchFilterModel) {
    this.searchFilterModel = searchFilter;
    this.displayPreview = false;
    this.search();
  }

  search() {
    if(this.searchText && typeof this.searchText !== undefined) {
    this.isLoading = true;
    this.coreService.setIsLoading(true);
    this.searchService
      .searchImage(
        this.searchText,
        this.imagesPerPage,
        this.pageNumber,
        this.searchFilterModel.searchInText,
        this.searchFilterModel.fromDate,
        this.searchFilterModel.toDate,
        this.searchFilterModel.contentType,
        this.searchFilterModel.colorCode,
        this.searchFilterModel.safe_search,
      )
      .pipe(takeUntil(this.destroyActions))
      .subscribe((result: PhotosRootModel) => {
        this.isLoading = false;
        this.coreService.setIsLoading(false);
        this.photos = result.photos;
      });
    }
  }

  loadNext(event: any) {
    this.pageNumber = event.first / this.imagesPerPage + 1;
    this.search();
  }

  previewImage(photo: Photo, index: number) {
    this.displayPreview = true;
    this.activeIndex = index;
  }

  public ngOnDestroy() {
    this.destroyActions.next(true);
    this.destroyActions.complete();
  }
}
