import { Entity, PrimaryKey } from "@mikro-orm/core"

export abstract class baseEntity{

 @PrimaryKey()
 id?: number

}