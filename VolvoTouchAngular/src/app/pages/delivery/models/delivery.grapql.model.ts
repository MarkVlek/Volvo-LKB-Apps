export interface Root {
    data: Data
  }
  
  export interface Data {
    carByRegistrationNumber: CarByRegistrationNumber
  }
  
  export interface CarByRegistrationNumber {
    car: Car
    registration: string
    vin: string
  }
  
  export interface Car {
    driveline: Driveline
    modelFamily: ModelFamily
    trim: Trim
    color: Color
    engine: Engine
    technicalData: TechnicalData
    upholstery: Upholstery
    displayName: string
    carKey: CarKey
    options: Option[]
    model: Model
  }
  
  export interface Driveline {
    content: Content
  }
  
  export interface Content {
    displayName: DisplayName
  }
  
  export interface DisplayName {
    value: string
  }
  
  export interface ModelFamily {
    displayName: DisplayName
  }
  
  
  export interface Trim {
    displayName: DisplayName
  }
  
  export interface Color {
    content: Content
  }
  
  export interface Engine {
    content: Content
  }
  
  export interface TechnicalData {
    fuelType: FuelType
  }
  
  export interface FuelType {
    formatted: string
  }
  
  export interface Upholstery {
    content: Content
  }
  
  export interface CarKey {
    modelYear: number
    salesVersion: string
    body: string
    engine: string
    marketingCode: string
    structureWeek: number
    steering: string
    gearbox: string
    upholstery: string
    carType: string
    specMarket: string
    color: string
    options: string[]
    packages: string[]
  }
  
  export interface Option {
    content: Content
  }
  
  export interface Model {
    description: Description
  }
  
  export interface Description {
    value: string
  }
  