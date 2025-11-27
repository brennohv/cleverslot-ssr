import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {
  GetImgUrlPipe,
  SpinnerComponent,
  UserStore,
} from 'ba-ngrx-signal-based';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  EditUserModalComponent,
  EditUserPhotoModalComponent,
} from '@client/my-account/components';
import {
  IEditUserDialodModel,
  IEditUserView,
} from '@client/my-account/data/types';

@Component({
  selector: 'app-my-account-page',
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    NgIf,
    SpinnerComponent,
    RouterLink,
    MatButtonModule,
    TranslocoPipe,
    TranslocoDirective,
    GetImgUrlPipe,
  ],
  templateUrl: './my-account-page.component.html',
  styleUrl: './my-account-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAccountPageComponent {
  #user = inject(UserStore);
  #dialog = inject(MatDialog);
  loading = this.#user.userLoading;
  userName = this.#user.username;
  userphoto = this.#user.photoUrl;
  email = this.#user.email;
  telephone = this.#user.telephone.internationalNumber;
  readonly IEditUserView = IEditUserView;
  readonly I18N_PREFFIX = 'mfClient.my-account.';

  openDialog(contenView: IEditUserView, title: string): void {
    this.#dialog.open<EditUserModalComponent, IEditUserDialodModel>(
      EditUserModalComponent,
      {
        minWidth: 350,
        data: { contentView: contenView, title: title },
      }
    );
  }

  openUploadModal(): void {
    this.#dialog.open<EditUserPhotoModalComponent>(
      EditUserPhotoModalComponent,
      {
        panelClass: ['s-large-dialog'],
      }
    );
  }
}
