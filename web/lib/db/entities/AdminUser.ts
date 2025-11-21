import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('admin_users')
export class AdminUser {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    name!: string;

    @Column({ type: 'text', unique: true })
    email!: string;

    @Column({ type: 'text', name: 'google_uid', unique: true })
    googleUid!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
