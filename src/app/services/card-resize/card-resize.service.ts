import { Injectable } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CardResizeService {
  public numCols: Observable<number> = of(4);
  gridByBreakpoint = {
    xl: 4,
    lg: 4,
    md: 3,
    sm: 2,
    xs: 1,
  };

  media: Observable<MediaChange[]>;
  constructor(private mediaObserver: MediaObserver) {
    this.media = this.mediaObserver.asObservable();
    this.numCols = this.media.pipe(
      map((mediaChanges: MediaChange[]) => {
        return this.gridByBreakpoint[mediaChanges[0].mqAlias];
      })
    );
  }
}
