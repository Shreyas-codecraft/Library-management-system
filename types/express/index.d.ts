import { I } from "vitest/dist/reporters-yx5ZTtEV";
import { IMember, IMemberBase } from "../../member-management/models/member.model";
import { Language, User } from "../custom";
export {};

declare global {
  namespace Express {
    export interface Request {
      id:any;
      role:any
    }
  }
}