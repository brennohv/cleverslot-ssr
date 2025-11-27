import { Injectable, signal } from '@angular/core';
import { IBarbershopConfigViewEnum } from '../../types';

@Injectable({
  providedIn: 'platform',
})
export class BarbershopConfigNavService {
  readonly currentView = signal<IBarbershopConfigViewEnum>(
    IBarbershopConfigViewEnum.BRAND
  );
  constructor() {}

  updateView(view: IBarbershopConfigViewEnum): void {
    this.currentView.update(() => view);
  }
}
