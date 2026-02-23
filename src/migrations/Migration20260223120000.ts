import { Migration } from '@mikro-orm/migrations';

export class Migration20260223120000 extends Migration {

  override async up(): Promise<void> {
    // Drop FKs that reference garage.cuit so we can change its type
    this.addSql(`alter table \`reservation_type\` drop foreign key \`reservation_type_garage_cuit_foreign\`;`);
    this.addSql(`alter table \`service\` drop foreign key \`service_garage_cuit_foreign\`;`);
    this.addSql(`alter table \`parking_space\` drop foreign key \`parking_space_garage_cuit_foreign\`;`);
    this.addSql(`alter table \`reservation\` drop foreign key \`reservation_garage_cuit_foreign\`;`);
    this.addSql(`alter table \`reservation\` drop foreign key \`reservation_parking_space_number_parking_space_ga_29ed8_foreign\`;`);

    // Widen CUIT columns to BIGINT UNSIGNED
    this.addSql(`alter table \`garage\` modify \`cuit\` bigint unsigned not null;`);
    this.addSql(`alter table \`reservation_type\` modify \`garage_cuit\` bigint unsigned not null;`);
    this.addSql(`alter table \`service\` modify \`garage_cuit\` bigint unsigned not null;`);
    this.addSql(`alter table \`parking_space\` modify \`garage_cuit\` bigint unsigned not null;`);
    this.addSql(`alter table \`reservation\` modify \`garage_cuit\` bigint unsigned not null;`);
    this.addSql(`alter table \`reservation\` modify \`parking_space_garage_cuit\` bigint unsigned not null;`);

    // Recreate FKs
    this.addSql(`alter table \`reservation_type\` add constraint \`reservation_type_garage_cuit_foreign\` foreign key (\`garage_cuit\`) references \`garage\` (\`cuit\`) on update cascade;`);
    this.addSql(`alter table \`service\` add constraint \`service_garage_cuit_foreign\` foreign key (\`garage_cuit\`) references \`garage\` (\`cuit\`) on update cascade;`);
    this.addSql(`alter table \`parking_space\` add constraint \`parking_space_garage_cuit_foreign\` foreign key (\`garage_cuit\`) references \`garage\` (\`cuit\`) on update cascade;`);
    this.addSql(`alter table \`reservation\` add constraint \`reservation_garage_cuit_foreign\` foreign key (\`garage_cuit\`) references \`garage\` (\`cuit\`) on update cascade;`);
    this.addSql(`alter table \`reservation\` add constraint \`reservation_parking_space_number_parking_space_ga_29ed8_foreign\` foreign key (\`parking_space_number\`, \`parking_space_garage_cuit\`) references \`parking_space\` (\`number\`, \`garage_cuit\`) on update cascade;`);
  }

}
