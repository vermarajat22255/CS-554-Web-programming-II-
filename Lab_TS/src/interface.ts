interface Iperson{
    firstName: string;
    lastName: string;
    sayHi: ()=> string;
}

// if interface is there it will work as a interface even when not implemented

let customer: Iperson= {
    firstName: "tom",
    lastName:"Billi",
    sayHi: ():string =>{
        return `Hello ${customer.firstName} ${customer.lastName}`;
    }
}
console.log(customer);