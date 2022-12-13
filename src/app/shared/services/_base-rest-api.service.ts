import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { HttpContentType } from '../model';

export abstract class BaseRestApiService {
  constructor(protected http: HttpClient) {}

  protected getAuthHeader(httpContentType?: HttpContentType): HttpHeaders {
    // Can Write Authentication related Logic
    return new HttpHeaders().append(
      'Content-Type',
      httpContentType ? httpContentType : 'application/json'
    );
  }

  protected baseGetOptions(httpContentType?: HttpContentType): any {
    return {
      headers: this.getAuthHeader(httpContentType),
      observe: 'response',
    };
  }

  protected processError(error: any): Observable<any> {
    if (error.status && error.status === 401) {
      return of({});
    }
    // if (
    //     error.status &&
    //     (error.status === 412 || error.status === 400 || error.status === 401)
    // ) {
    //     return throwError(() => error);
    // }

    return throwError(() => error);
  }

  protected get<T>(
    endpointUrl: string,
    extraParams?: any,
    urlParams?: any,
    httpContentType: HttpContentType = HttpContentType.json,
    retryCount: number = 0
  ): Observable<T> {
    let params: any = {};
    if (urlParams && urlParams.length !== 0) {
      // This code will generate Url with parameter
      urlParams.forEach((param: string, index: any) => {
        endpointUrl = endpointUrl.replace(
          `{${index}}`,
          encodeURIComponent(param)
        );
      });
    }
    if (extraParams) {
      params = { ...extraParams, ...params };
    }
    return this.http
      .get<T>(endpointUrl, {
        ...this.baseGetOptions(httpContentType),
        params,
      })
      .pipe(
        switchMap((res: any) => {
          return of(res.body);
        }),
        retry(retryCount),
        catchError((error: any, caught: Observable<any>) => {
          return this.processError(error);
        })
      );
  }
}
