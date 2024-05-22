
export interface Repository<O>{

findAll(): O[] | undefined
findOne(item: {dni: string}): O | undefined
add(item: O): O | undefined
update(item: O): O | undefined
delete(item:{dni: string}): O | undefined

}