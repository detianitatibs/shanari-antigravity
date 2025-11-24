import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { AdminUser } from './AdminUser';
import { Category } from './Category';
import { Tag } from './Tag';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    title!: string;

    @Column({ type: 'text', unique: true })
    slug!: string;

    @Column({ type: 'text', name: 'file_path' })
    filePath!: string;

    @Column({ type: 'text', nullable: true })
    thumbnail!: string;

    @Column({ type: 'text', default: 'draft' })
    status!: string;

    @Column({ type: 'datetime', name: 'published_at', nullable: true })
    publishedAt!: Date;

    @Column({ type: 'integer', name: 'author_id' })
    authorId!: number;

    @ManyToOne(() => AdminUser)
    @JoinColumn({ name: 'author_id' })
    author!: AdminUser;

    @ManyToMany(() => Category)
    @JoinTable({
        name: 'post_categories',
        joinColumn: { name: 'post_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    })
    categories!: Category[];

    @ManyToMany(() => Tag)
    @JoinTable({
        name: 'post_tags',
        joinColumn: { name: 'post_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
    })
    tags!: Tag[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
