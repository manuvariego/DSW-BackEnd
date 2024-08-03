import { MikroORM } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { MySqlDriver } from '@mikro-orm/mysql';
import dotenv from 'dotenv';

dotenv.config()
export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  driver: MySqlDriver,
  dbName: 'CocherasUTN',
  clientUrl: `mysql://${process.env.DBUSER}:${process.env.DBPASS}@localhost:3306/CocherasUTN`,
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {     //No utilizar nunca en produccion
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  }

})

export const syncSchema = async () => {

  const generator = orm.getSchemaGenerator()

  await generator.updateSchema()

}
