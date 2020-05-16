class emp{
    private _fullname : string;
    constructor(fullname?: string){
        this._fullname = fullname;
    }
    
    public get fullname() : string {
        return this._fullname;
    }
    
    public set fullname(fullname : string) {
        if(fullname){
            this._fullname = fullname;
        }else{
            throw "invalid";
        }
    }
    
    
}
let u1: emp = new emp();
u1.fullname = "bro Name";
console.log(u1.fullname);