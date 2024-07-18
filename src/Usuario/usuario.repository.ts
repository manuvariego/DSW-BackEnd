import { Repository } from "../shared/repository.js";
import { User } from "./usuario.entity.js";
import { getDatabase } from "../shared/db/connectdb.js";


const users = [
  new User(
    'Yamila',
    'Donzino',
    '44427692',
    'Buenos aires 1465',
    'yamidonzino@gmail.com',
    3416543212,
  ),
]

//export async function getUserById(id: string): Promise<User | null> {
//  const db = getDatabase();
//  const userCollection = db.collection<User>('users');
//  return await userCollection.findOne({ _id: new ObjectId(id) });
//}

export async function createUser(user: User): Promise<void> {
  const db = getDatabase();
  const userCollection = db.collection<User>('users');
  await userCollection.insertOne(user);
}

//export class UserRepository implements Repository<User>{
//
//
//  public findAll(): User[] | undefined {
//    return users
//  }
//
//
//  public findOne(item: { id: string }): User | undefined {
//      return users.find((user) => user.id === item.id)  
//  }
//
//
//  public add(item: User): User | undefined {
//      users.push(item)
//      return(item)
//  }
//
//
//  public update(item: User): User | undefined {
//    const userIndex = users.findIndex((user) => user.id === item.id)
//
//    if (userIndex !== -1){
//      users[userIndex] = { ...users[userIndex], ...item }
//    }
//    return users[userIndex]
//  }
//
//
//  public delete(item: { id: string }): User | undefined {
//    const characterIdx = users.findIndex((user) => user.id === item.id)
//
//    if (characterIdx !== -1) {
//      const deletedUsers = users[characterIdx]
//      users.splice(characterIdx, 1)
//      return deletedUsers
//    }
//  }
//
//}
