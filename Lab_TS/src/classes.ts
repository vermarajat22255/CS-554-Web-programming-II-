interface userInterface{
    name: string;
    age: number;
    email: string;
    register();
    payInvoice();
}
class employee implements userInterface{
    name: string
    email: string
    age: number
    constructor(name: string, email: string, age: number){
        this.name = name;
        this.email = email;
        this.age = age;
    }
    register(){
        console.log(`${this.name} is now registered...`)
    }
    payInvoice(){
        console.log(`${this.name} has paid the invoice..`)
    }
}
let e:userInterface = new employee("tom","billi",25);
e.register();
e.payInvoice();

class Member extends employee{
    id: number;
    constructor(id: number, name: string, email: string, age : number){
        super(name, email, age);
        this.id = id;
    }

}
let mer: Member = new Member(1,"mer","email id",5);
mer.payInvoice();