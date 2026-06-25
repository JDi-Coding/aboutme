import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {
  LocalizedText,
  Mission,
  MissionsService,
  SkillsData,
} from '../../services/missions.service';

interface MissionView {
  year: string;
  title: string;
  desc: string;
  skills: string[];
  statusLabel: string;
  statusClass: string;
  repo: string | null;
}

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [TranslateModule, NgClass],
  template: `
    <h2>{{ 'missions.title' | translate }}</h2>
    <p>{{ 'missions.subtitle' | translate }}</p>
    <div class="mission-timeline">
      @for (mission of missions; track mission.title) {
        <div class="timeline-item">
          <div class="timeline-marker">
            <span class="timeline-node" [ngClass]="mission.statusClass">{{ mission.year }}</span>
          </div>
          <div class="data-card">
            <span class="mission-status" [ngClass]="mission.statusClass">{{ mission.statusLabel }}</span>
            <h3>{{ mission.title }}</h3>
            <p>{{ mission.desc }}</p>
            <p class="skills-container">
              @for (skill of mission.skills; track skill) {
                <span>{{ skill }}</span>
              }
            </p>
            @if (mission.repo) {
              <button class="project-link">
                <a [href]="mission.repo" target="_blank" rel="noopener">
                  {{ 'missions.access' | translate }}
                </a>
              </button>
            } @else {
              <span class="classified">{{ 'missions.classified' | translate }}</span>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class MissionsComponent implements OnInit, OnDestroy {
  missions: MissionView[] = [];

  private raw: Mission[] = [];
  private data?: SkillsData;
  private langSub?: Subscription;

  constructor(
    private missionsService: MissionsService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.missionsService.load().subscribe(({ missions, skills }) => {
      this.raw = missions;
      this.data = skills;
      this.rebuild();
    });
    this.langSub = this.translate.onLangChange.subscribe(() => this.rebuild());
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  private rebuild(): void {
    if (!this.data) return;
    const lang = this.translate.currentLang || this.translate.defaultLang || 'en';
    this.missions = this.raw.map((m) => {
      const status = this.data!.statuses[m.status];
      return {
        year: m.year,
        title: this.localized(m.title, lang),
        desc: this.localized(m.desc, lang),
        skills: m.skills.map((id) => this.localized(this.data!.skills[id] ?? id, lang)),
        statusLabel: status ? status[lang] ?? status['en'] ?? m.status : m.status,
        statusClass: status?.class ?? '',
        repo: m.repo,
      };
    });
  }

  private localized(value: LocalizedText, lang: string): string {
    if (typeof value === 'string') return value;
    return value[lang] ?? value['en'] ?? Object.values(value)[0] ?? '';
  }
}
