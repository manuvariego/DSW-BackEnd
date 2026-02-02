import { Entity, PrimaryKey } from "@mikro-orm/core"

export abstract class baseEntity{

 @PrimaryKey({ autoincrement: true })
 id!: number

}