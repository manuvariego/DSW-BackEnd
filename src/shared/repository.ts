
export interface Repository<O>{

findAll(): O[] | undefined
findOne(item: {id: string}): O | undefined
add(item: O): O | undefined
update(item: O): O | undefined
delete(item:{id: string}): O | undefined

}