export class CreateUsersDto{
    constructor(user){
        this.FullName = `${user.first_name} ${user.last_name}`;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.age = user.age;
        this.role = user.role;
        this.Email = user.email;
        this.Password = user.password;
        
    }
}

export class GetUserDto{
    constructor(userDao){
        this.FullName = userDao.FullName;
        this.age= userDao.age;
        this.role = userDao.role;
    
        }
}