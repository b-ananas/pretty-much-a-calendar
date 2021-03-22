import { Field, Int, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { Photo } from "./Photo";

@ObjectType()
@Entity("dogs")
export class Dog extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;
  
  @Field()
  @Column() 
  telephone: string;

  @Field()
  @Column() 
  race: string;


  @Field(()=>[String])
  photos_data: string[]

  @OneToMany(() => Photo, photo => photo.dog, {cascade: true})
  photos: Photo[];
}
