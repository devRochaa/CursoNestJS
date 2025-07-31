import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RoutePermissions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @OneToMany(() => Usuario, usuario => usuario.role)
  usuarios: Usuario[];
}
