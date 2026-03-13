import { Injectable, signal } from '@angular/core';
import { IBarberConfigViewEnum } from '../../types';

@Injectable({
  providedIn: 'platform',
})
export class BarberConfigNavService {
  readonly currentView = signal<IBarberConfigViewEnum>(
    IBarberConfigViewEnum.PROFILE
  );
  constructor() {}

  updateView(view: IBarberConfigViewEnum): void {
    this.currentView.update(() => view);
  }
}
