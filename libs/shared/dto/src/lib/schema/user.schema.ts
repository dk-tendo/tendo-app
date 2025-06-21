import { Column, Table, Index } from '../decorators/table.decorators';

@Table('users')
@Index(['email'])
@Index(['created_at'])
export class UserSchema {
  @Column({ type: 'UUID', primary: true, default: 'gen_random_uuid()' })
  id?: string;

  @Column({ type: 'VARCHAR(255)', nullable: false, unique: true })
  email?: string;

  @Column({ type: 'VARCHAR(255)', nullable: false })
  first_name?: string;

  @Column({ type: 'VARCHAR(255)', nullable: false })
  last_name?: string;

  @Column({ type: 'VARCHAR(255)', default: "'patient'" })
  role?: string;

  @Column({ type: 'UUID', array: true })
  patient_ids?: string[];

  @Column({ type: 'VARCHAR(255)' })
  image_url?: string;

  @Column({ type: 'UUID' })
  clinic_id?: string;

  @Column({ type: 'UUID', array: true })
  incomplete_task_ids?: string[];

  @Column({ type: 'UUID', array: true })
  completed_task_ids?: string[];

  @Column({ type: 'TIMESTAMP WITH TIME ZONE', default: 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'TIMESTAMP WITH TIME ZONE', default: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}
