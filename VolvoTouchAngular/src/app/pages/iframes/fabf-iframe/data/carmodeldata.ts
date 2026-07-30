import { CarModel, Filter } from "../model/carmodel";

export var carModelList: CarModel[] = [
    {
        title: 'ex40-electric',
        displayTitle: 'EX40',
        img: 'assets/images/carmodels/ex40.png',
        cachedImg: "",
        cartype: "SUV",
        driveline: "Eldriven",
    },
    {
        title: 'ex30-electric',
        displayTitle: 'EX30',
        img: 'assets/images/carmodels/ex30.png',
        cartype: "SUV",
        driveline: "Eldriven",
        cachedImg: ""
    },
    {
        title: 'ex60-electric',
        displayTitle: 'EX60',
        img: 'assets/images/carmodels/ex60.png',
        cartype: "SUV",
        driveline: "Eldriven",
        cachedImg: ""
    },
    {
        title: 'ex90-electric',
        displayTitle: 'EX90',
        img: 'assets/images/carmodels/ex90.png',
        cachedImg: "",
        cartype: "SUV",
        driveline: "Eldriven",
    },
    {
        title: 'es90-electric',
        displayTitle: 'ES90',
        img: 'assets/images/carmodels/es90.png',
        cachedImg: "",
        cartype: "Sedan",
        driveline: "Eldriven",
    },
    {
        title: 'xc90-hybrid',
        displayTitle: 'XC90',
        img: 'assets/images/carmodels/XC90.png',
        cachedImg: "",
        cartype: "SUV",
        driveline: "Laddhybrid",
    },
    {
        title: 'xc60-hybrid',
        displayTitle: 'XC60',
        img: 'assets/images/carmodels/XC60.png',
        cachedImg: "",
        cartype: "SUV",
        driveline: "Laddhybrid",
    },
    {
        title: 'v60-hybrid',
        displayTitle: 'V60',
        img: 'assets/images/carmodels/V60.png',
        cachedImg: "",
        cartype: "Kombi",
        driveline: "Laddhybrid",
    },
    {
        title: 'ec40-electric',
        displayTitle: 'EC40',
        img: 'assets/images/carmodels/c40.png',
        cachedImg: "",
        cartype: "Crossover",
        driveline: "Eldriven",
    },
    {
        title: 'xc40',
        displayTitle: 'XC40',
        img: 'assets/images/carmodels/XC40.png',
        cachedImg: "",
        cartype: "SUV",
        driveline: "Mildhybrid",
    }
];

export var filterList: Filter[] = [
    {
        name: 'Alla',
        driveLine: 'Alla',
    },
    {
        name: 'Elbilar',
        driveLine: 'Eldriven',
    },
    {
        name: 'Laddhybrider',
        driveLine: 'Laddhybrid',
    },
    {
        name: 'Mildhybrider',
        driveLine: 'Mildhybrid',
    },
]