import { User } from "./usuario.entity.js";
import { Repository } from "../../shared/repository.js";

const users = [

    new User(
        'Yamila',
        'Donzino',
        '44.427.692',
        'Buenos aires 1465',
        'yamidonzino@gmail.com',
        3416543212

        ),

]

export class UserRepository implements Repository<User>{

    public findAll(): User[] | undefined {
      return users
    }
    
    public findOne(item: { dni: string; }): User | undefined {
      return users.find(user => user.dni === item.dni)
    
    }
    
    public add(item: User): User | undefined {
      users.push(item)
      return(item)
    }
    
    public update(item: User): User | undefined {
     const userIndex = users.findIndex(user =>{item === user})
    
     if (userIndex != -1){
    
      Object.assign(users[userIndex], item)
    
    }
    
    return users[userIndex]
    
    }
    
    public delete(item: { dni: string }): User | undefined {
     const userIndex = users.findIndex(user=>{user.dni === item.dni})
    
      const EliminatedUser = users[userIndex]
    
      if (userIndex != -1){
        users.splice(userIndex,1)
    }
    
     return EliminatedUser
    
    }
    
    }