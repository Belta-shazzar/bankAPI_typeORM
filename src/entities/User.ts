import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { MinLength, IsEmail } from "class-validator";

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ name: "full_name" })
  @MinLength(3, { message: "please enter full name" })
  private fullName: string;

  @Column({ unique: true })
  @IsEmail()
  private email: string;

  @Column()
  private password: string;

  constructor(fullName: string, email: string, password: string) {
    super()
    this.fullName = fullName;
    this.email = email;
    this.password = password;
  }
}
