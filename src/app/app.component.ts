import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DepotService } from './depot.service';

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
  sourceSelected: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private depotService: DepotService) {}

  ngOnInit() {
    this.depotTransferForm.controls.numberOfBoxes.setValue('');

    this.depotTransferForm.controls.sourceDepot.valueChanges.subscribe((value : string | null) => {
      if (value != null) {
        const selectedDepot = this.depotService.depotById(parseInt(value));

        if (selectedDepot !== undefined) {
          this.maximumNumberOfBoxesInSelectedSourceDepot = selectedDepot.numberOfBoxes;
          this.depotTransferForm.controls.numberOfBoxes.setValue('0');
          this.sourceSelected = true;
        } else {
          this.maximumNumberOfBoxesInSelectedSourceDepot = 0;
          this.depotTransferForm.controls.numberOfBoxes.setValue('');
          this.sourceSelected = false;
        }
      }
    });
  }

  public getUnselectedDepots(selectedDepotId: string | null) {
    const selectedDepotIds: number[] = selectedDepotId == null ? [] : [parseInt(selectedDepotId)];

    return this.depotService.depotsExceptIds(selectedDepotIds);
  }
}
