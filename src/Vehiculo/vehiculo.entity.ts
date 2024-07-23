import crypto from 'node:crypto'
import { baseEntity } from '../shared/baseEntity.entity.js';
import { Cascade, Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core';

@Entity()
export class Vehiculo extends baseEntity{
 @PrimaryKey()
  patente?: Number


}