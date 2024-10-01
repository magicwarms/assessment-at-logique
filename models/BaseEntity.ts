import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ name: 'created_date' })
    createdDate!: Date;

    @UpdateDateColumn({ name: 'updated_date', nullable: true })
    updatedDate?: Date;

    @DeleteDateColumn({ name: 'deleted_date', nullable: true })
    deletedDate?: Date;
}