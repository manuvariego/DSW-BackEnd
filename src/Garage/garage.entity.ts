import crypto from 'node:crypto'

export class Garage{
  constructor(
    public cuit: string,
    public name: string,
    public address: string,
    public telephone: string,
    public mail: string,
    public priceHour: number,
    public id = crypto.randomUUID()
) {}

}

//asdasd
