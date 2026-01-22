import { Migration } from '@mikro-orm/migrations';

export class Migration20260122032750 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`parking_space\` add \`name\` varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`parking_space\` drop column \`name\`;`);
  }

}
