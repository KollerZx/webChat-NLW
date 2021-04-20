import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateSettings1618922143908 implements MigrationInterface {

    /* Para rodar uma migration
     yarn typeorm migration:run */
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name:"settings",
                columns: [
                    {
                        name:"id",
                        type:"uuid",
                        isPrimary: true
                    },
                    {
                        name:"username",
                        type:"varchar"
                    },
                    {
                        name:"chat",
                        type:"boolean",
                        default: true
                    },
                    {
                        name:"updated_at",
                        type:"timestamp",
                        default: "now()"
                    },
                    {
                        name:"created_at",
                        type:"timestamp",
                        default: "now()"
                    },
                ]
            })
        )
    }

    /* Para reverter uma migration
    yarn typeorm migration:revert
    */
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("settings");
    }

}
