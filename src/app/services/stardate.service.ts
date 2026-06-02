import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class StardateService {

  readonly stardate$: Observable<string> = interval(10000).pipe(
    startWith(0),
    map(() => this.computeStardate())
  );

  private computeStardate(): string {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
    const yearProgress = (now.getTime() - startOfYear.getTime()) / (endOfYear.getTime() - startOfYear.getTime());

    const baseYear = 2323;
    const currentYear = now.getFullYear();
    const yearDiff = currentYear - baseYear;

    const stardateInt = yearDiff * 1000 + Math.floor(yearProgress * 1000);
    const stardateFrac = Math.floor((now.getHours() * 60 + now.getMinutes()) / 144);

    return `SD ${stardateInt}.${stardateFrac}`;
  }
}
