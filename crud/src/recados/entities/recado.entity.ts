import { Usuario } from 'src/usuario/entities/usuario.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  texto: string;

  //muitos recados podem ser enviados por uma única pessoa (emissor)
  @ManyToOne(() => Usuario)
  // especifica a coluna "de" que armazena o ID da pessoa que enviou o recado
  @JoinColumn({ name: 'de' })
  de: Usuario;

  //muitos recados podem ser enviados para uma única pessoa (emissor)
  //                                    'SET NULL'
  @ManyToOne(() => Usuario, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  // especifica a coluna "de" que armazena o ID da pessoa que recebeu o recado
  @JoinColumn({ name: 'para' })
  para: Usuario;

  @Column({ default: false })
  lido: boolean;

  @Column()
  data: Date; //createdAt

  @CreateDateColumn()
  createdAt?: Date; //createdAt

  @UpdateDateColumn()
  updatedAt?: Date; //createdAt
} //entidade pronta - modelo de criação
