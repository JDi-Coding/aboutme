import { Injectable } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { gsap } from 'gsap';

@Injectable({ providedIn: 'root' })
export class NavigationService {

  readonly activeRoute$ = new BehaviorSubject<string>('personnel');

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationStart)
    ).subscribe(() => {
      const el = document.querySelector('.viewer-content-wrapper');
      if (el) {
        gsap.to(el, { duration: 0.3, opacity: 0, scale: 0.95 });
      }
    });

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e) => {
      const navEnd = e as NavigationEnd;
      const el = document.querySelector('.viewer-content-wrapper');
      if (el) {
        gsap.fromTo(el,
          { opacity: 0, scale: 1.05 },
          { duration: 0.4, opacity: 1, scale: 1, ease: 'power2.out' }
        );
      }
      const segment = navEnd.urlAfterRedirects.replace('/', '').split('/')[0] || 'personnel';
      this.activeRoute$.next(segment);
    });
  }
}
