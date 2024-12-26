import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm'

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'slack_id', unique: true })
  slackId: string

  @Column()
  email: string

  @OneToMany(() => Intercambio, (intercambio) => intercambio.angelId)
  angel: Intercambio[]

  @OneToMany(() => Intercambio, (intercambio) => intercambio.ahijadoId)
  ahijado: Intercambio[]
}

@Entity({ name: 'intercambios' })
export class Intercambio {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Usuario, (usuario) => usuario.angel)
  @JoinColumn({ name: 'angel_id' })
  angelId: Usuario

  @ManyToOne(() => Usuario, (usuario) => usuario.ahijado)
  @JoinColumn({ name: 'ahijado_id' })
  ahijadoId: Usuario
}
