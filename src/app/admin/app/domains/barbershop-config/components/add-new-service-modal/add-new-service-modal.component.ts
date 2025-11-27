import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Inject,
  model,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  IBarbershopConfigService,
  INewServiceDialog,
} from '@admin/barbershop-config/data/types';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  FileUploadInputComponent,
  GetImgUrlPipe,
  IInputType,
  InputComponent,
  ModalBodyComponent,
  SpinnerDirective,
  FileInputValidators,
} from 'ba-ngrx-signal-based';
import { SafeResourceUrl } from '@angular/platform-browser';
import { MatButton } from '@angular/material/button';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BarbershopConfigServicesStore } from '@admin/barbershop-config/data/stores';
import { IProfessional } from '@admin/shared/data/types';

@Component({
  selector: 'app-add-new-service-modal',
  standalone: true,
  imports: [
    ModalBodyComponent,
    InputComponent,
    TranslocoPipe,
    TranslocoDirective,
    FileUploadInputComponent,
    MatButton,
    GetImgUrlPipe,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    SpinnerDirective,
  ],
  templateUrl: './add-new-service-modal.component.html',
  styleUrl: './add-new-service-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewServiceModalComponent implements OnInit {
  readonly I18N_PREFFIX =
    'mfAdmin.barbershop-config.config-services.add-new-service.';
  readonly maxSize = 20000000;
  readonly maxSizeInMb = this.maxSize / 1000000;
  readonly IInputType = IInputType;
  readonly currentProfessionalModel = model('');
  currentBarberElement =
    viewChild.required<ElementRef<HTMLInputElement>>('barbersInput');

  #barbershopConfigServicesStore = inject(BarbershopConfigServicesStore);

  newServiceForm = this.fb.group({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    value: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    duration: new FormControl<number>(30, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    professionalPercentage: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    recurrency: new FormControl<string>('€', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    photo: new FormControl<File | null>(null, [
      FileInputValidators.accept('image/*'),
      FileInputValidators.maxSize(20000000),
    ]),
  });

  photoPreviewFromPhotoChange = signal<SafeResourceUrl | null>(null);
  photoPreviewFromInjection = signal<string | null>(null);
  isLoading = this.#barbershopConfigServicesStore.allProfessionalsLoading;
  isEditMode = signal<boolean>(false);

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly selectedProfessionals = signal<IProfessional[]>([]);
  readonly allProfessionals =
    this.#barbershopConfigServicesStore.allProfessionals;

  readonly filteredProfessionals = computed(() => {
    const currentProfessional = this.currentProfessionalModel().toLowerCase();
    return currentProfessional
      ? this.allProfessionals().filter((professional) => {
          return `${professional.firstName} ${professional.lastName}`
            .toLowerCase()
            .includes(currentProfessional);
        })
      : this.allProfessionals().slice();
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IBarbershopConfigService,
    private dialogRef: MatDialogRef<
      AddNewServiceModalComponent,
      INewServiceDialog | null
    >,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (!this.allProfessionals().length) {
      this.#barbershopConfigServicesStore.getAllBarbers();
    }
    this.getDataFromInjection();
  }

  avoidAddByTypeInput(event: MatChipInputEvent): void {
    this.currentProfessionalModel.set('');
    event.chipInput.clear();
  }

  onImageChange(url: SafeResourceUrl | null): void {
    this.photoPreviewFromPhotoChange.update(() => url);
  }

  close(): void {
    this.dialogRef.close(null);
  }

  createEditService(): void {
    if (this.newServiceForm.invalid) {
      return;
    }

    const { duration, name, photo, professionalPercentage, recurrency, value } =
      this.newServiceForm.getRawValue();

    this.dialogRef.close({
      duration: Number(duration),
      name,
      photo,
      professionalPercentage: Number(professionalPercentage),
      recurrency,
      value: Number(value),
      barbers: this.selectedProfessionals(),
    });
  }

  private getDataFromInjection() {
    if (this.data) {
      this.isEditMode.update(() => true);
      const {
        duration,
        name,
        recurrency,
        professionalPercentage,
        value,
        photo,
        documentId,
      } = this.data;

      this.selectedProfessionals.update(() => {
        const currentService = this.#barbershopConfigServicesStore
          .services()
          .find((service) => service.documentId === documentId);
        return currentService?.barbers ?? [];
      });

      if (photo?.url) {
        this.photoPreviewFromInjection.update(() => photo.url!);
      }

      this.newServiceForm.patchValue({
        duration: Number(duration)!,
        name,
        professionalPercentage,
        value: value,
        recurrency,
      });
    }
  }

  remove(professional: IProfessional): void {
    this.selectedProfessionals.update((professionals) =>
      professionals.filter(
        (currentProf) => currentProf.documentId !== professional.documentId
      )
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedProfessionals.update((professionals) => {
      const isProfessionalInTheListAlready = !!professionals.find(
        (professional) =>
          professional.documentId === event.option.value.documentId
      );
      if (!isProfessionalInTheListAlready) {
        return [...professionals, event.option.value];
      }
      return professionals;
    });
    this.currentProfessionalModel.set('');
    this.currentBarberElement().nativeElement.value = '';

    event.option.deselect();
  }
}
