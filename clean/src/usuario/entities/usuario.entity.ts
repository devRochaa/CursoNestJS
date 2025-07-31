import { IsEmail } from 'class-validator';
import { RoutePolicies } from 'src/auth/constants/enum/route-policies.enum';
import { Recado } from 'src/recados/entities/recado.entity';
import { RoutePermissions } from 'src/route-permissions/entities/route-permission.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
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

  @Column({ default: true })
  active: boolean;

  // @Column({ type: 'simple-array', default: [] })
  // routePolicies: RoutePolicies[];

  @ManyToOne(() => RoutePermissions, role => role.usuarios)
  role: RoutePermissions;
}
