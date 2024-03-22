import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatSliderHarness } from '@angular/material/slider/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { AppComponent } from './app.component';

let fixture: ComponentFixture<AppComponent>;
let loader: HarnessLoader;

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent,
        NoopAnimationsModule
    ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);

  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'box-management-app' title`, () => {
    const app = fixture.componentInstance;
    expect(app.title).toEqual('box-management-app');
  });

  describe('depot transfer form', () => {
    it('should render form', async () => {
      // Arrange
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      const sliders = await loader.getAllHarnesses(MatSliderHarness);
      const buttons = await loader.getAllHarnesses(MatButtonHarness);

      // Act

      // Assert
      expect(selects.length).toBe(2);
      expect(sliders.length).toBe(1);
      expect(buttons.length).toBe(2);
    });

    describe('depot selection', () => {
      it('should have no source and target depots selected by default', async () => {
        // Arrange
        const selects = await loader.getAllHarnesses(MatSelectHarness);

        // Act

        // Assert
        const sourceSelection = await selects[0].getValueText();
        const targetSelection = await selects[1].getValueText();
        expect(sourceSelection).toBe('');
        expect(targetSelection).toBe('');
      });

      describe('source depot selected', async () => {
        let selects : MatSelectHarness[] | null;
        let buttons : MatButtonHarness[] | null;
        let sourceDepotSelect : MatSelectHarness | null;
        let targetDepotSelect : MatSelectHarness | null;
        let transferButton : MatButtonHarness | null;
        let resetButton : MatButtonHarness | null;

        beforeEach(async () => {
          selects = await loader.getAllHarnesses(MatSelectHarness);
          buttons = await loader.getAllHarnesses(MatButtonHarness);

          sourceDepotSelect = selects[0];
          targetDepotSelect = selects[1];

          transferButton = buttons[0];
          resetButton = buttons[1];

          await sourceDepotSelect.clickOptions({ text: 'Langenklint' });
        });

        it('should adapt target depot selection according to selected source depot', async () => {
          // Arrange

          // Act
          await targetDepotSelect!.open();

          // Assert
          const targetDepotOptions = await targetDepotSelect!.getOptions();
          expect(targetDepotOptions.length).toBe(2);
          expect((await targetDepotOptions[0].getText())).toBe('Gifhorn');
          expect((await targetDepotOptions[1].getText())).toBe('Meinersen');
        });

        it('should show number of boxes in selected depot', () => {
          // Arrange
          const sourceDepotNumberOfBoxLabel = fixture.nativeElement.querySelector('#sourceDepotBoxCount');

          // Act

          // Assert
          expect(sourceDepotNumberOfBoxLabel.textContent).toBe('200');
        });

        it('should enable reset button', async () => {
          // Arrange

          // Act
          const result = await resetButton?.isDisabled();

          // Assert
          expect(result).toBeFalse();
        });

        it('should keep transfer button disabled', async () => {
          // Arrange

          // Act
          const result = await transferButton?.isDisabled();

          // Assert
          expect(result).toBeTrue();
        });
      })
    });

    describe('target depot selected', async () => {
      let selects : MatSelectHarness[] | null;
      let buttons : MatButtonHarness[] | null;
      let sourceDepotSelect : MatSelectHarness | null;
      let targetDepotSelect : MatSelectHarness | null;
      let transferButton : MatButtonHarness | null;
      let resetButton : MatButtonHarness | null;

      beforeEach(async () => {
        selects = await loader.getAllHarnesses(MatSelectHarness);
        buttons = await loader.getAllHarnesses(MatButtonHarness);

        sourceDepotSelect = selects[0];
        targetDepotSelect = selects[1];

        transferButton = buttons[0];
        resetButton = buttons[1];

        await targetDepotSelect.clickOptions({ text: 'Gifhorn' });
      });

      it('should adapt source depot selection according to selected target depot', async () => {
        // Arrange

        // Act
        await sourceDepotSelect!.open();

        // Assert
        const sourceDepotOptions = await sourceDepotSelect!.getOptions();
        expect(sourceDepotOptions.length).toBe(2);
        expect((await sourceDepotOptions[0].getText())).toBe('Langenklint');
        expect((await sourceDepotOptions[1].getText())).toBe('Meinersen');
      });

      it('should show number of boxes in selected depot', () => {
        // Arrange
        const targetDepotNumberOfBoxLabel = fixture.nativeElement.querySelector('#targetDepotBoxCount');

        // Act

        // Assert
        expect(targetDepotNumberOfBoxLabel.textContent).toBe('60');
      });

      it('should enable reset button', async () => {
        // Arrange

        // Act
        const result = await resetButton?.isDisabled();

        // Assert
        expect(result).toBeFalse();
      });

      it('should keep transfer button disabled', async () => {
        // Arrange

        // Act
        const result = await transferButton?.isDisabled();

        // Assert
        expect(result).toBeTrue();
      });
    });

    describe('number-of-boxes slider', () => {
      it('should render number of box slider as disabled by default', async () => {
        // Arrange
        const sliders = await loader.getAllHarnesses(MatSliderHarness);
        const numberOfBoxesSlider = sliders[0];

        // Act
        const result = await numberOfBoxesSlider.isDisabled();

        // Assert
        expect(result).toBeTrue();
      });

      it('should enable box slider after selecting a source depot', async () => {
        // Arrange
        const selects = await loader.getAllHarnesses(MatSelectHarness);
        const sliders = await loader.getAllHarnesses(MatSliderHarness);
        const sourceDepotSelect = selects[0];
        const numberOfBoxesSlider = sliders[0];

        // Act
        await sourceDepotSelect.clickOptions({ text: 'Langenklint' });

        // Assert
        const result = await numberOfBoxesSlider.isDisabled();
        expect(result).toBeFalse();
      });

      it('should set maximum number on box slider after selecting a source depot', async () => {
        // Arrange
        const selects = await loader.getAllHarnesses(MatSelectHarness);
        const sliders = await loader.getAllHarnesses(MatSliderHarness);
        const sourceDepotSelect = selects[0];
        const numberOfBoxesSlider = sliders[0];

        // Act
        await sourceDepotSelect.clickOptions({ text: 'Langenklint' });

        // Assert
        const result = await numberOfBoxesSlider.getMaxValue();
        expect(result).toBe(200);
      });

      it('should set the value to 0 on box slider after selecting a new source depot', async () => {
        // Arrange
        const selects = await loader.getAllHarnesses(MatSelectHarness);
        const sliders = await loader.getAllHarnesses(MatSliderHarness);
        const sourceDepotSelect = selects[0];
        const numberOfBoxesSlider = sliders[0];

        // Act
        await sourceDepotSelect.clickOptions({ text: 'Langenklint' });
        const thumb = await numberOfBoxesSlider.getEndThumb();
        await thumb.setValue(200);
        await sourceDepotSelect.clickOptions({ text: 'Gifhorn' });

        // Assert
        const resultThumb = await numberOfBoxesSlider.getEndThumb();
        const result = await resultThumb.getValue();
        expect(result).toBe(0);
      });
    });

    describe('transfer boxes', () => {
      let selects : MatSelectHarness[] | null;
      let sliders : MatSliderHarness[] | null;
      let buttons : MatButtonHarness[] | null;
      let sourceDepotSelect : MatSelectHarness | null;
      let targetDepotSelect : MatSelectHarness | null;
      let numberOfBoxesSlider : MatSliderHarness | null;
      let transferButton : MatButtonHarness | null;

      beforeEach(async () => {
        selects = await loader.getAllHarnesses(MatSelectHarness);
        sliders = await loader.getAllHarnesses(MatSliderHarness);
        buttons = await loader.getAllHarnesses(MatButtonHarness);

        sourceDepotSelect = selects[0];
        targetDepotSelect = selects[1];

        numberOfBoxesSlider = sliders[0];

        transferButton = buttons[0];
      });

      describe('succeeds', () => {
        beforeEach(async () => {
          // Arrange
          const endThumb = await numberOfBoxesSlider!.getEndThumb();

          jasmine.clock().install();

          await sourceDepotSelect!.clickOptions({ text: 'Langenklint' });
          await targetDepotSelect!.clickOptions({ text: 'Gifhorn' });

          await endThumb.setValue(50);

          // Act
          await transferButton!.click();
        })

        afterEach(() => {
          jasmine.clock().uninstall();
        });

        it('should transfer the selected amout of boxes', async () => {
          // Arrange

          // Act

          // Assert
          fixture.whenStable().then(() => {
            const transferResultLabel = fixture.nativeElement.querySelector('#transferResult');
            expect(transferResultLabel.textContent).toBe('Transferred 50 boxes from Langenklint (150) to Gifhorn (110).');
          });
        });

        it('should remove result message', async () => {
          // Arrange

          // Act
          jasmine.clock().tick(5001);
          fixture.detectChanges();

          // Assert
          fixture.whenStable().then(() => {
            const transferResultLabel = fixture.nativeElement.querySelector('#transferResult');
            expect(transferResultLabel.textContent).toBe('');
          });
        });
      });
    });
  });
});
