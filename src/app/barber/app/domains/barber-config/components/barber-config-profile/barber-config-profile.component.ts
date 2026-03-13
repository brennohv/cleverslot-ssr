import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  inject,
} from '@angular/core';
import { BarberConfigStore } from '@barber/barber-config/data/stores';
import { GetImgUrlPipe } from 'ba-ngrx-signal-based';
import { MatDialog } from '@angular/material/dialog';
import { UploadProfileImageModalComponent } from '../upload-profile-image-modal/upload-profile-image-modal.component';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatListModule } from '@angular/material/list';
import { EditProfessionalModalComponent } from '../edit-professional-modal/edit-professional-modal.component';
import {
  IEditProfessionalModalData,
  IEditProfessionalView,
} from '@barber/barber-config/data/types';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-barber-config-profile',
  standalone: true,
  imports: [
    GetImgUrlPipe,
    MatCardModule,
    MatIcon,
    TranslocoPipe,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './barber-config-profile.component.html',
  styleUrl: './barber-config-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarberConfigProfileComponent implements OnInit {
  #injector = inject(Injector);
  #barberConfigStore = inject(BarberConfigStore);
  #dialog = inject(MatDialog);
  barber = this.#barberConfigStore.barber;
  readonly IEditProfessionalView = IEditProfessionalView;
  readonly I18N_PREFFIX = 'mfBarber.barber-config.config-profile.';

  openUploadModal(): void {
    this.#dialog.open<UploadProfileImageModalComponent>(
      UploadProfileImageModalComponent,
      {
        injector: this.#injector,
        panelClass: ['s-large-dialog'],
        data: {
          barber: this.barber,
          barberConfigStore: this.#barberConfigStore,
        },
      },
    );
  }

  openEditUserNameModal(
    contenView: IEditProfessionalView,
    title: string,
  ): void {
    this.#dialog.open<
      EditProfessionalModalComponent,
      IEditProfessionalModalData
    >(EditProfessionalModalComponent, {
      injector: this.#injector,
      minWidth: 350,
      data: { contentView: contenView, title: title },
    });
  }

  ngOnInit(): void {
    this.#barberConfigStore.getBarberProfile();
  }
}
