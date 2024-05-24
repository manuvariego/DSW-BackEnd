import { Repository } from "../shared/repository.js";
import { Garage } from "./garage.entity.js";


const garages = [
  new Garage(
    '20447652367',
    'Paradoja',
    'Italia 2400',
    '3876312845',
    'yamidonzino@gmail.com',
    2500,
  ),
]

export class GarageRepository implements Repository<Garage>{
  
  
  public findAll(): Garage[] | undefined {
    return garages
  }
  

  public findOne(item: { id: string }): Garage | undefined {
      return garages.find((garage) => garage.id === item.id)  
  }


  public add(item: Garage): Garage | undefined {
      garages.push(item)
      return(item)
  }
    

  public update(item: Garage): Garage | undefined {
    const garageIndex = garages.findIndex((garage) => garage.id === garage.id)
    
    if (garageIndex !== -1){
      garages[garageIndex] = { ...garages[garageIndex], ...item }
    }
    return garages[garageIndex]
  }
  
  
  public delete(item: { id: string }): Garage | undefined {
    const garageIndex = garages.findIndex((garage) => garage.id === item.id)

    if (garageIndex !== -1) {
      const deletedgarages = garages[garageIndex]
      garages.splice(garageIndex, 1)
      return deletedgarages
    }
  }
    
}
