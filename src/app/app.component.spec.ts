import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatSliderHarness } from '@angular/material/slider/testing';
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

      // Act

      // Assert
      expect(selects.length).toBe(2);
      expect(sliders.length).toBe(1);
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

      it('should adapt target depot selection according to selected source depot', async () => {
        // Arrange
        const selects = await loader.getAllHarnesses(MatSelectHarness);
        const sourceDepotSelect = selects[0];
        const targetDepotSelect = selects[1];

        // Act
        await sourceDepotSelect.clickOptions({ text: 'Langenklint' });

        // Assert
        await targetDepotSelect.open();
        const targetDepotOptions = await targetDepotSelect.getOptions();
        expect(targetDepotOptions.length).toBe(2);
        expect((await targetDepotOptions[0].getText())).toBe('Gifhorn');
        expect((await targetDepotOptions[1].getText())).toBe('Meinersen');
      });
    });

    it('should adapt source depot selection according to selected target depot', async () => {
      // Arrange
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      const sourceDepotSelect = selects[0];
      const targetDepotSelect = selects[1];

      // Act
      await targetDepotSelect.clickOptions({ text: 'Gifhorn' });

      // Assert
      await sourceDepotSelect.open();
      const sourceDepotOptions = await sourceDepotSelect.getOptions();
      expect(sourceDepotOptions.length).toBe(2);
      expect((await sourceDepotOptions[0].getText())).toBe('Langenklint');
      expect((await sourceDepotOptions[1].getText())).toBe('Meinersen');
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
  });
});
