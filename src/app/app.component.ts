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
    "name": "CBD",
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
      }]
  },
  {
    "name": "XYZ",
    "values": [
      {
        "year": 2022,
        "value": 1387.2
      },
      {
        "year": 2025,
        "value": 4587.2
      },
      {
        "year": 2030,
        "value": 3587.2
      },
      {
        "year": 2035,
        "value": 7633.32
      },
      {
        "year": 2040,
        "value": 4874.3
      },
      {
        "year": 2045,
        "value": 1323.2
      },
      {
        "year": 2050,
        "value": 5222.2
      }
    ]
  },
  {
    "name": "HHH",
    "values": [
      {
        "year": 2022,
        "value": 4387.2
      },
      {
        "year": 2025,
        "value": 2587.2
      },
      {
        "year": 2030,
        "value": 8327.2
      },
      {
        "year": 2035,
        "value": 2113.32
      },
      {
        "year": 2040,
        "value": 8824.3
      },
      {
        "year": 2045,
        "value": 3333.2
      },
      {
        "year": 2050,
        "value": 8111.2
      }
    ]
  },
  {
    "name": "XZW",
    "values": [
      {
        "year": 2022,
        "value": 3287.2
      },
      {
        "year": 2025,
        "value": 2757.2
      },
      {
        "year": 2030,
        "value": 5321.2
      },
      {
        "year": 2035,
        "value": 7113.32
      },
      {
        "year": 2040,
        "value": 2524.3
      },
      {
        "year": 2045,
        "value": 6333.2
      },
      {
        "year": 2050,
        "value": 3132.2
      }
    ]
  }
  ]
}
