import { Entity, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'books' })  // Ensure table name is plural
export class Book extends BaseEntity {
    @Column({ name: "title" })
    title!: string;

    @Column({ name: "author" })
    author!: string;

    @Column({ name: "published_year" })
    publishedYear!: number;

    @Column("text", { array: true })
    genres!: string[];

    @Column({ name: "stock" })
    stock!: number;
}