import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'd3-app';
  graphData = [{
    "name": "ABC",
    "values": [
      {
        "year": 2022,
        "value": 6587.2
      },
      {
        "year": 2025,
        "value": 3587.2
      },
      {
        "year": 2030,
        "value": 7587.2
      },
      {
        "year": 2035,
        "value": 4324.32
      },
      {
        "year": 2040,
        "value": 8259.3
      },
      {
        "year": 2045,
        "value": 3337.2
      },
      {
        "year": 2050,
        "value": 5387.2
      }
    ]
  },
  {
    "name": "BSF",
    "values": [
      {
        "year": 2022,
        "value": 3387.2
      },
      {
        "year": 2025,
        "value": 6587.2
      },
      {
        "year": 2030,
        "value": 4587.2
      },
      {
        "year": 2035,
        "value": 1324.32
      },
      {
        "year": 2040,
        "value": 7229.3
      },
      {
        "year": 2045,
        "value": 3333.2
      },
      {
        "year": 2050,
        "value": 7532.2
      }
    ]
  }]
}
