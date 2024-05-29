import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { Station, StationWithBoxEstimate } from './depot.service';

let httpClient: HttpClient;
let httpTestingController: HttpTestingController;
let fixture: ComponentFixture<AppComponent>;
let loader: HarnessLoader;

const depots : Station[] = [
  { id: 1, name: 'Langenklint', location: '' },
  { id: 2, name: 'Gifhorn', location: '' },
  { id: 3, name: 'Meinersen', location: '' }
];

const depotsWithBoxEstimates : StationWithBoxEstimate[] = [
  { ...depots[0], estimate_boxes: 200 },
  { ...depots[1], estimate_boxes: 60 },
  { ...depots[2], estimate_boxes: 0 },
];

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AppComponent,
        NoopAnimationsModule
    ],
    }).compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AppComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);

    const req = httpTestingController.expectOne('https://localhost/boxmanagement/station/');
    expect(req.request.method).toEqual('GET');
    req.flush(depots);

    depotsWithBoxEstimates.forEach(depot => {
      const req = httpTestingController.expectOne(`https://localhost/boxmanagement/station/${depot.id}`);
      expect(req.request.method).toEqual('GET');
      req.flush(depot);
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'box-management-app' title`, () => {
    const app = fixture.componentInstance;
    expect(app.title).toEqual('box-management-app');
  });
});
