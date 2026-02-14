import { Migration } from '@mikro-orm/migrations';

export class Migration20260214161257 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`location\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null, \`province\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`garage\` (\`cuit\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null, \`password\` varchar(255) not null, \`address\` varchar(255) not null, \`phone_number\` varchar(255) not null, \`email\` varchar(255) not null, \`location_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`garage\` add index \`garage_location_id_index\`(\`location_id\`);`);

    this.addSql(`create table \`reservation_type\` (\`description\` varchar(255) not null, \`garage_cuit\` int unsigned not null, \`price\` int not null, primary key (\`description\`, \`garage_cuit\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`reservation_type\` add index \`reservation_type_garage_cuit_index\`(\`garage_cuit\`);`);

    this.addSql(`create table \`service\` (\`id\` int unsigned not null auto_increment primary key, \`description\` varchar(255) not null, \`price\` int not null, \`garage_cuit\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`service\` add index \`service_garage_cuit_index\`(\`garage_cuit\`);`);

    this.addSql(`create table \`type_vehicle\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`parking_space\` (\`number\` int unsigned not null, \`garage_cuit\` int unsigned not null, \`type_vehicle_id\` int unsigned not null, primary key (\`number\`, \`garage_cuit\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`parking_space\` add index \`parking_space_garage_cuit_index\`(\`garage_cuit\`);`);
    this.addSql(`alter table \`parking_space\` add index \`parking_space_type_vehicle_id_index\`(\`type_vehicle_id\`);`);

    this.addSql(`create table \`user\` (\`id\` int unsigned not null auto_increment primary key, \`dni\` varchar(255) not null, \`name\` varchar(255) not null, \`lastname\` varchar(255) not null, \`password\` varchar(255) not null, \`address\` varchar(255) not null, \`email\` varchar(255) not null, \`phone_number\` varchar(255) not null, \`role\` varchar(255) not null, \`reset_token\` varchar(255) null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`user\` add unique \`user_dni_unique\`(\`dni\`);`);

    this.addSql(`create table \`vehicle\` (\`license_plate\` varchar(255) not null, \`owner_id\` int unsigned not null, \`type_id\` int unsigned not null, primary key (\`license_plate\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`vehicle\` add index \`vehicle_owner_id_index\`(\`owner_id\`);`);
    this.addSql(`alter table \`vehicle\` add index \`vehicle_type_id_index\`(\`type_id\`);`);

    this.addSql(`create table \`reservation\` (\`id\` int unsigned not null auto_increment primary key, \`date_time_reservation\` datetime not null, \`check_in_at\` datetime not null, \`check_out_at\` datetime not null, \`status\` varchar(255) not null default 'activa', \`amount\` int not null, \`payment_method\` varchar(255) null, \`vehicle_license_plate\` varchar(255) not null, \`garage_cuit\` int unsigned not null, \`parking_space_number\` int unsigned not null, \`parking_space_garage_cuit\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`reservation\` add index \`reservation_vehicle_license_plate_index\`(\`vehicle_license_plate\`);`);
    this.addSql(`alter table \`reservation\` add index \`reservation_garage_cuit_index\`(\`garage_cuit\`);`);
    this.addSql(`alter table \`reservation\` add index \`reservation_parking_space_number_parking_space_garage_cuit_index\`(\`parking_space_number\`, \`parking_space_garage_cuit\`);`);

    this.addSql(`create table \`reservation_services\` (\`id\` int unsigned not null auto_increment primary key, \`reservation_id\` int unsigned not null, \`service_id\` int unsigned not null, \`status\` varchar(255) not null default 'pendiente') default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`reservation_services\` add index \`reservation_services_reservation_id_index\`(\`reservation_id\`);`);
    this.addSql(`alter table \`reservation_services\` add index \`reservation_services_service_id_index\`(\`service_id\`);`);

    this.addSql(`alter table \`garage\` add constraint \`garage_location_id_foreign\` foreign key (\`location_id\`) references \`location\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`reservation_type\` add constraint \`reservation_type_garage_cuit_foreign\` foreign key (\`garage_cuit\`) references \`garage\` (\`cuit\`) on update cascade;`);

    this.addSql(`alter table \`service\` add constraint \`service_garage_cuit_foreign\` foreign key (\`garage_cuit\`) references \`garage\` (\`cuit\`) on update cascade;`);

    this.addSql(`alter table \`parking_space\` add constraint \`parking_space_garage_cuit_foreign\` foreign key (\`garage_cuit\`) references \`garage\` (\`cuit\`) on update cascade;`);
    this.addSql(`alter table \`parking_space\` add constraint \`parking_space_type_vehicle_id_foreign\` foreign key (\`type_vehicle_id\`) references \`type_vehicle\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`vehicle\` add constraint \`vehicle_owner_id_foreign\` foreign key (\`owner_id\`) references \`user\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`vehicle\` add constraint \`vehicle_type_id_foreign\` foreign key (\`type_id\`) references \`type_vehicle\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`reservation\` add constraint \`reservation_vehicle_license_plate_foreign\` foreign key (\`vehicle_license_plate\`) references \`vehicle\` (\`license_plate\`) on update cascade;`);
    this.addSql(`alter table \`reservation\` add constraint \`reservation_garage_cuit_foreign\` foreign key (\`garage_cuit\`) references \`garage\` (\`cuit\`) on update cascade;`);
    this.addSql(`alter table \`reservation\` add constraint \`reservation_parking_space_number_parking_space_ga_29ed8_foreign\` foreign key (\`parking_space_number\`, \`parking_space_garage_cuit\`) references \`parking_space\` (\`number\`, \`garage_cuit\`) on update cascade;`);

    this.addSql(`alter table \`reservation_services\` add constraint \`reservation_services_reservation_id_foreign\` foreign key (\`reservation_id\`) references \`reservation\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`reservation_services\` add constraint \`reservation_services_service_id_foreign\` foreign key (\`service_id\`) references \`service\` (\`id\`) on update cascade;`);
  }

}
