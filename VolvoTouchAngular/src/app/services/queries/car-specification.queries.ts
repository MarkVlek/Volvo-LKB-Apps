

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

export function getModelCodeGraphQLQuery(reg: string) {
    const REG = reg;
    const LOCALE = "sv-se";
    return {
        query: 
        `fragment GripDetailsQuery on VEHICLE_SPECIFICATION {
            _rawFromGrip
          }
          
          query SpecificationByTokenDetailsQuery($LOCALE: String!, $REG: String!) {
            specificationByReg(
              REG: $REG
              LOCALE: $LOCALE
              PRICE_CONFIG_IN: { name: "default", variableReferences: [] }
            ) {
              pno12
              slug
              vin
              token
              ...GripDetailsQuery
            }
          }`,
        variables: {
            REG, LOCALE
        }
    }
}