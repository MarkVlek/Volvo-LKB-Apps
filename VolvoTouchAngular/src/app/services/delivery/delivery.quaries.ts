export function signInGraphQLQuery() {
    return {
        "id": "<key>"
        , "password": "<pwd"
    }
}

export function generateTokenGraphQLQuery(keyId: any) {
    return {
        "key_id": keyId,
        "ttl": 3600
    }
}

export function getSpecificationByTokenGraphQLQueryV3(vin, locale) {
  return {
    query: "query DeliveryModelData($vin: String!, $locale: String!) {\r\n  carByVin(vin: $vin) {\r\n    car {\r\n      driveline {\r\n        content(locale: $locale) {\r\n          displayName {\r\n            value\r\n          }\r\n        }\r\n      }\r\n      modelFamily(locale: $locale) {\r\n        displayName {\r\n          value\r\n        }\r\n      }\r\n      trim(locale: $locale) {\r\n        displayName {\r\n          value\r\n        }\r\n      }\r\n      color {\r\n        content(locale: $locale) {\r\n          displayName {\r\n            value\r\n          }\r\n        }\r\n      }\r\n      engine {\r\n        content(locale: $locale) {\r\n          displayName {\r\n            value\r\n          }\r\n        }\r\n      }\r\n      technicalData(locale: $locale) {\r\n        fuelType {\r\n          formatted\r\n        }\r\n      }\r\n      upholstery {\r\n        content(locale: $locale) {\r\n          displayName {\r\n            value\r\n          }\r\n        }\r\n      }\r\n      displayName(locale: $locale)\r\n      carKey\r\n      options {\r\n        content(locale: $locale) {\r\n          displayName {\r\n            value\r\n          }\r\n        }\r\n      }\r\n      model(locale: $locale) {\r\n        description {\r\n          value\r\n        }\r\n      }\r\n    }\r\n    registration\r\n    vin\r\n  }\r\n}",
    variables: {"vin":vin,"locale":locale}
  }
}


export function getSpecificationByTokenGraphQLQueryV2(registration, locale) {
  return {
    query: "query DeliveryModelData($registration: String!, $locale: String!) {\r\n  carByRegistrationNumber(registration: $registration) {\r\n    car {\r\n      driveline {\r\n        content(locale: $locale) {\r\n          displayName {\r\n            value\r\n          }\r\n        }\r\n      }\r\n      modelFamily(locale: $locale) {\r\n        displayName {\r\n          value\r\n        }\r\n      }\r\n      trim(locale: $locale) {\r\n        displayName {\r\n          value\r\n        }\r\n      }\r\n      color {\r\n        content(locale: $locale) {\r\n          displayName {\r\n            value\r\n          }\r\n        }\r\n      }\r\n      engine {\r\n        content(locale: $locale) {\r\n          displayName {\r\n            value\r\n          }\r\n        }\r\n      }\r\n      technicalData(locale: $locale) {\r\n        fuelType {\r\n          formatted\r\n        }\r\n      }\r\n      upholstery {\r\n        content(locale: $locale) {\r\n          displayName {\r\n            value\r\n          }\r\n        }\r\n      }\r\n      displayName(locale: $locale)\r\n      carKey\r\n      options {\r\n        content(locale: $locale) {\r\n          displayName {\r\n            value\r\n          }\r\n        }\r\n      }\r\n      model(locale: $locale) {\r\n        description {\r\n          value\r\n        }\r\n      }\r\n    }\r\n    registration\r\n  }\r\n}",
    variables: {"registration":registration,"locale":locale}
  }
}

export function getSpecificationByTokenGraphQLQuery(regNr: any) {
    var REG = regNr;
    var LOCALE = "sv-se";

    return {
        query: `
        fragment GripDetailsQuery on VEHICLE_SPECIFICATION {
            _rawFromGrip
            gripVinOptions {
              vinOptionCode
              vinOption
              vinOptionLocal
            }
            gripVinOptionPackages {
              vinOptionPackageCode
              vinOptionPackage
              vinOptionPackagePrice
              vinOptionPackageType
              vinOptions {
                vinOptionCode
                vinOption
                vinOptionLocal
              }
              vinOptionDescription
            }
            gripVinStandardFeatures {
              vinStandardFeatureCode
              vinStandardFeature
            }
          }
          fragment VehicleConfigurationDetailsQuery on VEHICLE_SPECIFICATION {
            configuration {
              configurationInformation {
                driveline {
                  description
                  displayName
                }
                family {
                  description
                  displayName
                }
                model {
                  description
                  displayName
                }
                trimLevel {
                  description
                  displayName
                }
              }
              color{
                  displayName
                name
                }
              engine{
                displayName
              }
              
              gearbox {
                displayName
              }
              modelFamily {
                displayName
              }
              modelYear
              options {
                name
                included
                displayName
                category
                userSelected
                visible
              }
              overview {
                fuelType {
                  displayName
                }
                gearboxType {
                  displayName
                }
                driveType {
                  displayName
                }
                engineType {
                  displayName
                }
              }
              packages {
                name
                description
                displayName
                included
                required {
                  name
                  displayName
                }
              }
              pno34Plus
              salesVersion {
                displayName
              }
              structureWeek
              
              upholstery {
                displayName
                name
              }
            }
          }
          query SpecificationByTokenDetailsQuery(
            $LOCALE: String!
            $REG: String!
          ) {
            specificationByReg(
              REG:$REG
              LOCALE:$LOCALE
              PRICE_CONFIG_IN:{
                name:"default"
                variableReferences:[]
              }
            ) {
              pno12
              slug
              vin
              token
              ...GripDetailsQuery
              ...VehicleConfigurationDetailsQuery
            }
          }
        `,
        variables: {
            REG, LOCALE
        }
    }
}
