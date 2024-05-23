import crypto from 'node:crypto'

export class User{
  constructor(
    public name: string,
    public lastname: string,
    public dni: string,
    public address: string,
    public mail: string,
    public telephone: number,
    public id = crypto.randomUUID()
) {}

}

//asdasd