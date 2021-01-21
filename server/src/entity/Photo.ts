import { Field, Int, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne,/* CreateDateColumn*/ } from "typeorm";
import { Dog } from "./Dog";

@ObjectType()
@Entity("photos")
export class Photo extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  desc: string;

  // @Column()
  // filename: string;



  @ManyToOne(() => Dog, dog => dog.photos, {eager: true})
    dog: Dog;
}
