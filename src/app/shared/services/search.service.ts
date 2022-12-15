import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpContentType, Photo, PhotosRootModel } from '../model';
import { BaseRestApiService } from './_base-rest-api.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService extends BaseRestApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  public searchImage(
    searchText: string,
    imagesPerPage: number,
    pageNumber: number,
    searchInText: boolean = true,
    fromDate: Date,
    toDate: Date,
    imageContentTypes: string,
    colorCode: string,
    dimensionMode?: number
  ): Observable<PhotosRootModel> {
    let urlParam: any = {};
    urlParam.method = 'flickr.photos.search';
    urlParam.api_key = '935a15b96c21e62c5ab32501bd9da533';

    if (searchInText) {
      urlParam.text = searchText;
    } else {
      urlParam.tags = searchText;
    }

    urlParam.format = 'json';

    urlParam.nojsoncallback = 1;
    urlParam.per_page = imagesPerPage;
    urlParam.page = pageNumber;

    if (fromDate) {
      urlParam.min_taken_date = new Date(fromDate).getTime() / 1000;
    }

    if (toDate) {
      urlParam.max_taken_date = new Date(toDate).getTime() / 1000;
    }

    if (imageContentTypes) {
      urlParam.content_types = imageContentTypes;
    }

    if (dimensionMode) {
      urlParam.dimension_search_mode = dimensionMode;
    }

    if (colorCode) {
      urlParam.color_codes = colorCode;
    }

    urlParam.sort = 'relevance';
    urlParam.parse_tags = 1;
    urlParam.content_type = 7;
    urlParam.extras = 'owner_name,realname,description,title,date_taken';
    return this.get<PhotosRootModel>(
      `${environment.flickerApiUrl}`,
      urlParam,
      null,
      HttpContentType.text
    );
  }

  public searchImagesFromUser(
    user: string,
  ) {
    let urlParam: any = {};
    urlParam.method = "flickr.people.getPublicPhotos";
    urlParam.user_id = user;
    urlParam.api_key = "935a15b96c21e62c5ab32501bd9da533";
    urlParam.format = 'json';
    urlParam.nojsoncallback = 1;
    urlParam.per_page = 10;

    return this.get<PhotosRootModel>(
      `${environment.flickerApiUrl}`,
      urlParam,
      null,
      HttpContentType.text
    );

  }

}
