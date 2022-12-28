import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ColorSwatch, SearchFilterModel } from 'src/app/shared/model';
import { CoreService } from '../core.service';

@Component({
  selector: 'app-image-filter',
  templateUrl: './image-filter.component.html',
})
export class ImageFilterComponent implements OnInit, OnDestroy {
  protected destroyActions = new Subject<boolean>();
  @Output() onSelect = new EventEmitter<SearchFilterModel>();
  blockedDocument = true;
  selectedOrientationValues: string[] = [];

  fromDate!: Date;
  toDate!: Date;
  maxDateValue = new Date();

  searchInOptions: any[] = [];
  selectedSearchInOptions: boolean = true;

  imageContentTypes: any[] = [];
  selectedImageContentTypes: any[] = [];

  safeSearchFilter : boolean;

  mediaType : string;

  colorSwatchs: ColorSwatch[] = [];
  constructor(private coreService: CoreService) {
    this.searchInOptions = [
      { name: 'All ', value: true },
      { name: 'Tags', value: false },
    ];

    this.imageContentTypes = [
      { label: 'Photos', key: 'photo', value: 0 },
      { label: 'Screenshots', key: 'screenshot', value: 1 },
      { label: 'Illustration/Art', key: 'illustration', value: 2 },
      { label: 'Virtual Photography', key: 'vphoto', value: 3 },
    ];

    this.colorSwatchs = [
      {
        colorCode: '#ff2000',
        color: '0',
        label: 'Red',
        isLightColor: false,
        isSelected: false,
      },
      {
        colorCode: '#a24615',
        color: '1',
        label: 'Dark orange',
        isLightColor: false,
        isSelected: false,
      },
      {
        colorCode: '#ff7c00',
        color: '2',
        label: 'Orange',
        isLightColor: false,
        isSelected: false,
      },
      {
        colorCode: '#ff9f9c',
        color: 'b',
        label: 'Pale Pink',
        isLightColor: false,
        isSelected: false,
      },
      {
        colorCode: '#fffa00',
        color: '4',
        label: 'Lemon yellow',
        isLightColor: true,
        isSelected: false,
      },
      {
        colorCode: '#ffcf00',
        color: '3',
        label: 'School bus yellow',
        isLightColor: true,
        isSelected: false,
      },
      {
        colorCode: '#90e200',
        color: '5',
        label: 'Green',
        isLightColor: false,
        isSelected: false,
      },
      {
        colorCode: '#00ab00',
        color: '6',
        label: 'Dark lime green',
        isLightColor: false,
        isSelected: false,
      },
      {
        colorCode: '#00b2d4',
        color: '7',
        label: 'Cyan',
        isLightColor: false,
        isSelected: false,
      },
      {
        colorCode: '#0062c6',
        color: '8',
        label: 'Blue',
        isLightColor: false,
        isSelected: false,
      },
      {
        colorCode: '#8c20ba',
        color: '9',
        label: 'Violet',
        isLightColor: false,
        isSelected: false,
      },
      {
        colorCode: '#f52394',
        color: 'a',
        label: 'Pink',
        isLightColor: false,
        isSelected: false,
      },
      {
        colorCode: '#ffffff',
        color: 'c',
        label: 'White',
        isLightColor: true,
        isSelected: false,
      },
      {
        colorCode: '#7c7c7c',
        color: 'd',
        label: 'Gray',
        isLightColor: false,
        isSelected: false,
      },
      {
        colorCode: '#000000',
        color: 'e',
        label: 'Black',
        isLightColor: false,
        isSelected: false,
      },
    ];

    this.selectedImageContentTypes = this.imageContentTypes;

    this.mediaType = 'all';
    this.safeSearchFilter = true;
  }

  ngOnInit(): void {
    this.coreService
      .getIsLoading()
      .pipe(takeUntil(this.destroyActions))
      .subscribe((isLoading: boolean) => {
        this.blockedDocument = isLoading;
      });
  }

  selectSwatch(colorSwatch: ColorSwatch) {
    colorSwatch.isSelected = !colorSwatch.isSelected;
    this.filterEmit();
  }

  selectMediaType(type : string) {
    this.mediaType = type;
    this.filterEmit();
  }

  activateSafeSearch() {
    this.filterEmit();
  }

  filterEmit() {
    this.onSelect.emit(
      new SearchFilterModel({
        searchInText: this.selectedSearchInOptions,
        contentType: this.selectedImageContentTypes
          .map((a) => a.value)
          .toString(),
        fromDate: this.fromDate,
        toDate: this.toDate,
        colorCode: this.colorSwatchs
          .filter((e) => e.isSelected === true)
          .map((c) => c.color)
          .toString(),
        safe_search: this.safeSearchFilter ? 1 : 2, // 1 = safe ; 3 = restricted
      })
    );
  }

  public ngOnDestroy() {
    this.destroyActions.next(true);
    this.destroyActions.complete();
  }
}
