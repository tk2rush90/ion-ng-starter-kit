import { Injectable } from '@angular/core';
import { ApiService } from '../api-service';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileApiService extends ApiService {
  constructor() {
    super(environment.host.backend + '/file');
  }

  upload(file: File, width?: number): Observable<string>;
  upload(files: File[], width?: number): Observable<string[]>;
  upload(
    fileOrFiles: File | File[],
    width?: number,
  ): Observable<string | string[]>;
  upload(
    fileOrFiles: File | File[],
    width?: number,
  ): Observable<string | string[]> {
    const formData = new FormData();

    if (fileOrFiles instanceof Array) {
      fileOrFiles.forEach((_file) => {
        formData.append('files', _file);
      });
    } else {
      formData.append('files', fileOrFiles);
    }

    if (width) {
      formData.append('width', width.toString());
    }

    return this._http.post<string[]>(this.host + '/upload', formData).pipe(
      map((ids) => {
        return ids.length === 1 ? ids[0] : ids;
      }),
    );
  }
}
