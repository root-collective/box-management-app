import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DepotService } from './depot.service';
import { Depot } from './depot';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSliderModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'box-management-app';
  depotTransferForm = this.formBuilder.group({
    sourceDepot: ['', Validators.required],
    targetDepot: ['', Validators.required],
    numberOfBoxes: ['', [Validators.required, Validators.min(1)]]
  });
  maximumNumberOfBoxesInSelectedSourceDepot: number = 0;
  maximumNumberOfBoxesInSelectedTargetDepot: number = 0;
  sourceSelected: boolean = false;
  targetSelected: boolean = false;
  sourceDepot : Depot | undefined;
  targetDepot : Depot | undefined;
  transferResultMessage: string = '';

  constructor(private formBuilder: FormBuilder,
    private depotService: DepotService) {}

  ngOnInit() {
    this.depotTransferForm.controls.numberOfBoxes.setValue('');

    this.depotTransferForm.controls.sourceDepot.valueChanges.subscribe((value : string | null) => {
      if (value != null) {
        this.sourceDepot = this.depotService.depotById(parseInt(value));

        this.sourceSelected = this.sourceDepot !== undefined;

        if (this.sourceDepot !== undefined) {
          this.maximumNumberOfBoxesInSelectedSourceDepot = this.sourceDepot.numberOfBoxes;
          this.depotTransferForm.controls.numberOfBoxes.setValue('0');
        } else {
          this.maximumNumberOfBoxesInSelectedSourceDepot = 0;
          this.depotTransferForm.controls.numberOfBoxes.setValue('');
        }
      }
    });

    this.depotTransferForm.controls.targetDepot.valueChanges.subscribe((value : string | null) => {
      if (value != null) {
        this.targetDepot = this.depotService.depotById(parseInt(value));

        this.targetSelected = this.targetDepot !== undefined;

        if (this.targetDepot !== undefined) {
          this.maximumNumberOfBoxesInSelectedTargetDepot = this.targetDepot.numberOfBoxes;
        } else {
          this.maximumNumberOfBoxesInSelectedTargetDepot = 0;
        }
      }
    });
  }

  public getUnselectedDepots(selectedDepotId: string | null) {
    const selectedDepotIds: number[] = selectedDepotId == null ? [] : [parseInt(selectedDepotId)];

    return this.depotService.depotsExceptIds(selectedDepotIds);
  }

  public transfer() : void {
    if (this.sourceDepot != null && this.targetDepot != null && this.depotTransferForm.controls.numberOfBoxes.value != null) {
      const numberOfBoxesToTransfer = parseInt(this.depotTransferForm.controls.numberOfBoxes.value);

      this.depotService.transferBoxes(this.sourceDepot.id, this.targetDepot.id, numberOfBoxesToTransfer);

      this.transferResultMessage = `Transferred ${numberOfBoxesToTransfer} boxes from ${this.sourceDepot.name} (${this.sourceDepot.numberOfBoxes}) to ${this.targetDepot.name} (${this.targetDepot.numberOfBoxes}).`;

      setTimeout(() => {
        this.transferResultMessage = '';
      }, 5000);
    }

    this.reset();
  }

  public reset() : void {
    this.depotTransferForm.controls.sourceDepot.setValue(null);
    this.depotTransferForm.controls.targetDepot.setValue(null);

    this.sourceSelected = false;
    this.targetSelected = false;

    this.maximumNumberOfBoxesInSelectedSourceDepot = 0;
    this.maximumNumberOfBoxesInSelectedTargetDepot = 0;

    this.depotTransferForm.controls.numberOfBoxes.setValue('0');
  }
}
