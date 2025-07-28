import { IsEmail } from 'class-validator';
import { Recado } from 'src/recados/entities/recado.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //uma pessoa pode ter enviado muitos recados (como "de")
  //esses recados são relacionados ao campo "de" na enitidade recado
  @OneToMany(() => Recado, recado => recado.de)
  recadosEnviados: Recado[];

  //uma pessoa pode ter recebido muitos recados (como "para")
  //esses recados são relacionados ao campo "para" na enitidade recado
  @OneToMany(() => Recado, recado => recado.para)
  recadosRecebidos: Recado[];
}
