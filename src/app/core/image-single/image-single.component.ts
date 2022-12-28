import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CoreService } from '../core.service';
import { Photo, Photos, PhotosRootModel } from '../../shared/model';
import { SearchService } from '../../shared/services/search.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';


@Component({
  selector: 'app-image-single',
  templateUrl: './image-single.component.html',
  styleUrls: ['./image-single.component.scss']
})
export class ImageSingleComponent implements OnInit, OnDestroy, OnChanges {
  protected destroyActions = new Subject<boolean>();
  @Input() activePhoto! : Photo;
  @Input() activeIndex! : number;
  display  = false;
  photos : any;
  photosFromUser!: Observable<Photos>;
  tags : string[] = [];
  buddyCon!: string;

  ngOnInit() {}

  constructor(
    public searchService: SearchService,
    private coreService: CoreService) 
    {}

  ngOnChanges(changes: SimpleChanges): void {
    this.display = true;
    this.setPhoto(changes['activePhoto'].currentValue)
  }

  findPhotosFromUser(photo: Photo) {
    this.setBuddyCon();
    this.coreService.setIsLoading(true);
    const photos = this.searchService.searchImagesFromUser(photo.owner).pipe(takeUntil(this.destroyActions)).subscribe((res: PhotosRootModel) => {
      this.coreService.setIsLoading(false);
      this.photosFromUser = of(res.photos);
    })
  }

  setPhoto(photo : Photo) {
    this.activePhoto = photo;
    this.tags = photo.tags.split(" ");
    this.findPhotosFromUser(photo);
  }

  setBuddyCon() {
    const {iconfarm, iconserver, owner} = this.activePhoto;
    if(iconfarm && iconfarm > 0 && iconserver && owner) {
      this.buddyCon = `http://farm${iconfarm}.staticflickr.com/${iconserver}/buddyicons/${owner}.jpg`;
    } else {
      this.buddyCon = "https://www.flickr.com/images/buddyicon.gif";
    }
  }

  public ngOnDestroy() {
  }

}
