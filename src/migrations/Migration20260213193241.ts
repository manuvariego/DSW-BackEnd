import { Migration } from '@mikro-orm/migrations';

export class Migration20260213193241 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`reservation_services\` drop foreign key \`reservation_services_reservation_id_foreign\`;`);
    this.addSql(`alter table \`reservation_services\` drop foreign key \`reservation_services_service_id_foreign\`;`);

    this.addSql(`alter table \`user\` add \`reset_token\` varchar(255) null;`);

    this.addSql(`alter table \`reservation\` add \`payment_method\` varchar(255) null;`);

    this.addSql(`alter table \`reservation_services\` drop primary key;`);

    this.addSql(`alter table \`reservation_services\` add \`id\` int unsigned not null, add \`status\` varchar(255) not null default 'pendiente';`);
    this.addSql(`alter table \`reservation_services\` add constraint \`reservation_services_reservation_id_foreign\` foreign key (\`reservation_id\`) references \`reservation\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`reservation_services\` add constraint \`reservation_services_service_id_foreign\` foreign key (\`service_id\`) references \`service\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`reservation_services\` add primary key \`reservation_services_pkey\`(\`id\`);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`reservation_services\` drop foreign key \`reservation_services_reservation_id_foreign\`;`);
    this.addSql(`alter table \`reservation_services\` drop foreign key \`reservation_services_service_id_foreign\`;`);

    this.addSql(`alter table \`user\` drop column \`reset_token\`;`);

    this.addSql(`alter table \`reservation\` drop column \`payment_method\`;`);

    this.addSql(`alter table \`reservation_services\` drop primary key;`);
    this.addSql(`alter table \`reservation_services\` drop column \`id\`, drop column \`status\`;`);

    this.addSql(`alter table \`reservation_services\` add constraint \`reservation_services_reservation_id_foreign\` foreign key (\`reservation_id\`) references \`reservation\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`reservation_services\` add constraint \`reservation_services_service_id_foreign\` foreign key (\`service_id\`) references \`service\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`reservation_services\` add primary key \`reservation_services_pkey\`(\`reservation_id\`, \`service_id\`);`);
  }

}
