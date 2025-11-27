import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AddNewAddressModalComponent,
  AddNewContactModalComponent,
  BarbershopConfigCardComponent,
  BarbershopConfigHeaderComponent,
} from '@admin/barbershop-config/components';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import { BarbershopConfigAddressContactStore } from '@admin/barbershop-config/data/stores';
import { SpinnerComponent, SpinnerDirective } from 'ba-ngrx-signal-based';
import { MatDialog } from '@angular/material/dialog';
import {
  IBarbershopAddressDTO,
  IBarbershopContactDTO,
} from '@admin/barbershop-config/data/types';
import { first } from 'rxjs';

@Component({
  selector: 'app-barbershop-config-address-contact',
  standalone: true,
  providers: [BarbershopConfigAddressContactStore],
  imports: [
    BarbershopConfigHeaderComponent,
    BarbershopConfigCardComponent,
    TranslocoPipe,
    TranslocoDirective,
    SpinnerComponent,
    SpinnerDirective,
  ],
  templateUrl: './barbershop-config-address-contact.component.html',
  styleUrl: './barbershop-config-address-contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopConfigAddressContactComponent {
  readonly I18N_PREFFIX_ADDRESS =
    'mfAdmin.barbershop-config.config-address-contact.address.';
  readonly I18N_PREFFIX_CONTACT =
    'mfAdmin.barbershop-config.config-address-contact.contact.';
  #barbershopConfigAddressContactStore = inject(
    BarbershopConfigAddressContactStore
  );

  address = this.#barbershopConfigAddressContactStore.address;
  telephone = this.#barbershopConfigAddressContactStore.telephone;
  isLoaded = this.#barbershopConfigAddressContactStore.loaded;
  isLoading = this.#barbershopConfigAddressContactStore.loading;

  constructor(public dialog: MatDialog) {}

  openModalAddress(context: 'create' | 'edit'): void {
    const dialogRef = this.dialog.open<
      AddNewAddressModalComponent,
      IBarbershopAddressDTO | null,
      IBarbershopAddressDTO | null
    >(AddNewAddressModalComponent, {
      panelClass: ['s-large-dialog'],
      ...(context === 'edit' && {
        data: {
          street: this.address()!.street,
          number: this.address()!.number,
          postalCode: this.address()!.postalCode,
          city: this.address()?.city,
          complement: this.address()?.complement,
          country: this.address()?.country,
          id: this.address()?.id,
        },
      }),
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((resp) => {
        if (resp) {
          this.#barbershopConfigAddressContactStore.updateCreateAddressSetup({
            ...resp,
          });
        }
      });
  }

  openModalContact(context: 'create' | 'edit'): void {
    const dialogRef = this.dialog.open<
      AddNewContactModalComponent,
      IBarbershopContactDTO | null,
      IBarbershopContactDTO | null
    >(AddNewContactModalComponent, {
      panelClass: ['s-large-dialog'],
      ...(context === 'edit' && {
        data: {
          countryCode: this.telephone()!.countryCode,
          dialCode: this.telephone()!.dialCode,
          internationalNumber: this.telephone()!.internationalNumber,
          number: this.telephone()!.number,
          e164Number: this.telephone()?.e164Number,
          nationalNumber: this.telephone()?.nationalNumber,
          id: this.telephone()?.id,
        },
      }),
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((resp) => {
        if (resp) {
          this.#barbershopConfigAddressContactStore.updateCreateContactSetup({
            ...resp,
          });
        }
      });
  }
}
