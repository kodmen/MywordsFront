//import { Authority } from "./authority";
export class CurrentUser {
    id: number;
    login :  String ;
    firstName :  String ;
    lastName :  String ;
    email :  String ;
    imageUrl :  String ;
    activated : Boolean;
    langKey :  String ;
    createdBy :  String ;
    createdDate : String;
    lastModifiedBy :  String ;
    lastModifiedDate : String;
    authorities : String[];
}
