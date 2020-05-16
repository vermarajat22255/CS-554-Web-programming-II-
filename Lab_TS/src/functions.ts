function sum(a:number, b: number): number{
    return a+b;
}
///console.log(sum(5,4));

let add = function add( x: any, y:any):number{
    return x+y;
}
console.log(add('4',4));

let showName = (firstName: string, lastName?: string): string=>{
    if(lastName) return firstName+" "+lastName;
    return firstName;
}
console.log(showName("Rajat"))