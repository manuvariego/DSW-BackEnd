
export interface Repository<O>{

findAll(): O[] | undefined
findOne(item: {dni: number}): O | undefined
add(item: O): O | undefined
update(item: O): O | undefined
delete(item:{dni: number}): O | undefined

}