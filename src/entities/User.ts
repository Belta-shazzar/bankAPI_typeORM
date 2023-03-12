import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { MinLength, IsEmail } from "class-validator";

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "full_name" })
  @MinLength(3, { message: "please enter full name" })
  fullName: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;
}
