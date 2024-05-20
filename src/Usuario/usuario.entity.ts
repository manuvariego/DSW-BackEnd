import crypto from "node:crypto"

export class User{

constructor(

public name: string,
public lastname: string,
public dni: number,
public address: string,
public mail: string,
public telephone: number

){}

}