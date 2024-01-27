export default class UserDTO{
	constructor(userDB){
	this.fullname=`${userDB.first_name} ${userDB.last_name}`;
	this.email=userDB.email;
	this.role=userDB.role;
	this._id=userDB._id;
	this.last_Connection= new Date(userDB.last_Conection);
	this.carts=userDB.carts;
}
};
