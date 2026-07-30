import { CarModel } from "../pages/accessories/car.model";

// Do we need model years? Why not always take all of them and skip these model years interiely.
// IF you search by car today and dont find year then your screwed
// Only goes to 2025

export var carModelList: CarModel[] = [
  {
    title: 'EX30',
    displayTitle: 'EX30',
    img: 'assets/images/carmodels/ex30.png',
    cachedImg: "",
    modelCodes: [
    { year: 2023, code: 416 },
    { year: 2024, code: 416 },
    { year: 2025, code: 416 },
    { year: 2026, code: 416 }
    ],
  },
  {
    title: 'EX30 CC',
    displayTitle: 'EX30 Cross Country',
    img: 'assets/images/carmodels/ex30_cc.png',
    cachedImg: "",
    modelCodes: [
    { year: 2023, code: 417 },
    { year: 2024, code: 417 },
    { year: 2025, code: 417 },
    { year: 2026, code: 417 }
    ],
  },
  {
    title: 'EX40',
    displayTitle: 'EX40/XC40',
    img: 'assets/images/carmodels/ex40.png',
    cachedImg: "",
    modelCodes: [
    { year: 2023, code: 536 },
    { year: 2024, code: 536 },
    { year: 2025, code: 536 },
    { year: 2026, code: 536 }
    ],
  },
  {
    title: 'EX60',
    displayTitle: 'EX60',
    img: 'assets/images/carmodels/ex60.png',
    cachedImg: "",
    modelCodes: [
    { year: 2026, code: 516 }
    ],
  },
  {
    title: 'EX90',
    displayTitle: 'EX90',
    img: 'assets/images/carmodels/ex90.png',
    cachedImg: "",
    modelCodes: [
    { year: 2023, code: 356 },
    { year: 2024, code: 356 },
    { year: 2025, code: 356 },
    { year: 2026, code: 356 }
    ],
  },
  {
    title: 'EC40',
    displayTitle: 'EC40/C40',
    img: 'assets/images/carmodels/c40.png',
    cachedImg: "",
    modelCodes: [
      { year: 2022, code: 340 },
      { year: 2023, code: 340 },
      { year: 2024, code: 340 },
      { year: 2025, code: 340 },
      { year: 2026, code: 340 }
    ],
  },
  {
    title: 'XC60',
    displayTitle: 'XC60',
    img: 'assets/images/carmodels/XC60.png',
    cachedImg: "",
    modelCodes: [
      { year: 2018, code: 246 },
      { year: 2019, code: 246 },
      { year: 2020, code: 246 },
      { year: 2021, code: 246 },
      { year: 2022, code: 246 },
      { year: 2023, code: 246 },
      { year: 2024, code: 246 },
      { year: 2025, code: 246 },
      { year: 2026, code: 246 }
    ],
  },
  {
    title: 'XC90',
    displayTitle: 'XC90',
    img: 'assets/images/carmodels/XC90.png',
    cachedImg: "",
    modelCodes: [
      { year: 2018, code: 256 },
      { year: 2019, code: 256 },
      { year: 2020, code: 256 },
      { year: 2021, code: 256 },
      { year: 2022, code: 256 },
      { year: 2023, code: 256 },
      { year: 2024, code: 256 },
      { year: 2025, code: 256 },
      { year: 2026, code: 256 }
    ],
  },
  {
    title: 'ES90',
    displayTitle: 'ES90',
    img: 'assets/images/carmodels/es90.png',
    cachedImg: "",
    modelCodes: [
    { year: 2023, code: 334 },
    { year: 2024, code: 334 },
    { year: 2025, code: 334 },
    { year: 2025, code: 334 },
    { year: 2026, code: 334 }
    ],
  },
  {
    title: 'V60',
    displayTitle: 'V60',
    img: 'assets/images/carmodels/V60.png',
    cachedImg: "",
    modelCodes: [
      { year: 2018, code: 225 },
      { year: 2019, code: 225 },
      { year: 2020, code: 225 },
      { year: 2021, code: 225 },
      { year: 2022, code: 225 },
      { year: 2023, code: 225 },
      { year: 2024, code: 225 },
      { year: 2025, code: 225 },
      { year: 2026, code: 225 }
    ],
  },
  {
    title: 'V60',
    displayTitle: 'V60 Cross Country',
    img: 'assets/images/carmodels/v60_cc.png',
    cachedImg: "",
    modelCodes: [
    { year: 2023, code: 227 },
    { year: 2024, code: 227 },
    { year: 2025, code: 227 },
    { year: 2026, code: 227 }
    ],
  },
  {
    title: 'V90',
    displayTitle: 'V90',
    img: 'assets/images/carmodels/V90.png',
    cachedImg: "",
    modelCodes: [
      { year: 2018, code: 235 },
      { year: 2019, code: 235 },
      { year: 2020, code: 235 },
      { year: 2021, code: 235 },
      { year: 2022, code: 235 },
      { year: 2023, code: 235 },
      { year: 2024, code: 235 },
      { year: 2025, code: 235 },
      { year: 2026, code: 235 }
    ],
  },
  {
    title: 'V90',
    displayTitle: 'V90 Cross Country',
    img: 'assets/images/carmodels/v90_cc.png',
    cachedImg: "",
    modelCodes: [
    { year: 2023, code: 236 },
    { year: 2024, code: 236 },
    { year: 2025, code: 236 },
    { year: 2026, code: 236 }
    ],
  },
  {
    title: 'V60',
    displayTitle: 'S60',
    img: 'assets/images/carmodels/S60.png',
    cachedImg: "",
    modelCodes: [
    { year: 2023, code: 236 },
    { year: 2024, code: 236 },
    { year: 2025, code: 236 },
    { year: 2026, code: 236 }
    ],
  },
  {
    title: 'V90',
    displayTitle: 'S90',
    img: 'assets/images/carmodels/s90.png',
    cachedImg: "",
    modelCodes: [
    { year: 2023, code: 236 },
    { year: 2024, code: 236 },
    { year: 2025, code: 236 },
    { year: 2026, code: 236 }
    ],
  }
];

export var exclusionList: any[] = [
  {
    carModel: "S90",
    code: "A00112"
  },
  {
    carModel: "S90",
    code: "A00254"
  },
  {
    carModel: "S90",
    code: "A01638"
  },
  {
    carModel: "S90",
    code: "A00456"
  },
  {
    carModel: "S90",
    code: "A00056"
  },
  {
    carModel: "S90",
    code: "A00078"
  },
  {
    carModel: "S90",
    code: "A00189"
  },
  {
    carModel: "S90",
    code: "A00464"
  },
  {
    carModel: "S90",
    code: "A00106"
  },
  {
    carModel: "S90",
    code: "A00382"
  },
  {
    carModel: "S90",
    code: "A01601"
  },
  {
    carModel: "S90",
    code: "A00456"
  },
  {
    carModel: "S90",
    code: "A00594"
  },
  {
    carModel: "S60",
    code: "A00112"
  },
  {
    carModel: "S60",
    code: "A00106"
  },
  {
    carModel: "S60",
    code: "A00189"
  },
  {
    carModel: "S60",
    code: "A00382"
  },
  {
    carModel: "S60",
    code: "A01601"
  },
  {
    carModel: "S60",
    code: "A00456"
  },
  {
    carModel: "S60",
    code: "A01638"
  }
]