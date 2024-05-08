export class CreateUsersDto{
    constructor(user){
        this.FullName = `${user.first_name} ${user.last_name}`;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.age = user.age;
        this.role = user.role;
        this.Email = user.email;
        this.Password = user.password;
        this.id= user._id;
        this.profileImage= user.profileImage;
        this.cart=user.cart;
    }
}

export class GetUserDto{
    constructor(userDao){
        this.first_name = userDao.first_name;
        this.last_name = userDao.last_name;
        this.email = userDao.email
        this.age= userDao.age;
        this.role = userDao.role;
        }
}