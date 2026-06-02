import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  imports: [NgClass],
  styles: [`
    .lang-switcher {
      display: flex;
      gap: 4px;
      align-items: center;
    }
    .lang-btn {
      background: transparent;
      border: 2px solid var(--lcars-gold);
      color: var(--lcars-gold);
      font-family: 'Antonio', sans-serif;
      font-size: 0.85rem;
      font-weight: bold;
      padding: 3px 9px;
      border-radius: 4px;
      cursor: pointer;
      letter-spacing: 0.05em;
      transition: background 0.2s, color 0.2s;
    }
    .lang-btn:hover {
      background: var(--lcars-gold);
      color: black;
    }
    .lang-btn.active {
      background: var(--lcars-gold);
      color: black;
    }
    .lang-sep {
      color: var(--lcars-gold);
      font-size: 0.75rem;
      opacity: 0.5;
    }
  `],
  template: `
    <div class="lang-switcher">
      <button class="lang-btn" [class.active]="currentLang === 'de'" (click)="setLang('de')">DE</button>
      <span class="lang-sep">/</span>
      <button class="lang-btn" [class.active]="currentLang === 'en'" (click)="setLang('en')">EN</button>
    </div>
  `,
})
export class LangSwitcherComponent {
  currentLang: string;

  constructor(private translate: TranslateService) {
    this.currentLang = translate.currentLang || translate.defaultLang || 'en';
  }

  setLang(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
