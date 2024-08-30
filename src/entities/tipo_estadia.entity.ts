import { Entity, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class TipoEstadia{
  @PrimaryKey()
  tipoE!: string; 

}