import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

/** A label that is either language-neutral (string) or per-language ({ en, de, ... }). */
export type LocalizedText = string | { [lang: string]: string };

export interface StatusDef {
  /** CSS class used to color the status label, e.g. "status-finished". */
  class: string;
  [lang: string]: string;
}

export interface SkillsData {
  skills: { [id: string]: LocalizedText };
  statuses: { [id: string]: StatusDef };
}

export interface Mission {
  id: string;
  /** Year shown on the timeline node, e.g. "2023". */
  year: string;
  title: LocalizedText;
  desc: LocalizedText;
  /** Skill ids referencing keys in skills.json. */
  skills: string[];
  /** Status id referencing keys in skills.json statuses. */
  status: string;
  /** GitHub repo URL, or null → renders as CLASSIFIED. */
  repo: string | null;
}

/** Loads the mission catalog and the shared skill/status definitions. */
@Injectable({ providedIn: 'root' })
export class MissionsService {
  constructor(private http: HttpClient) {}

  load(): Observable<{ missions: Mission[]; skills: SkillsData }> {
    return forkJoin({
      missions: this.http.get<Mission[]>('./assets/data/missions.json'),
      skills: this.http.get<SkillsData>('./assets/data/skills.json'),
    });
  }
}
