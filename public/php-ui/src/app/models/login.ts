export class Login{

    #username!:string;
    #password!:string;
    constructor(username:string, password:string){
        this.#username = username;
        this.#password = password
    }


    get username(){
        return this.#username
    }

    get password(){
        return this.#password
    }


}