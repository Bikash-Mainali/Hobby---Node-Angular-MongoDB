

export class JwtToken {
    #username!: string;
    #name!: string
    #token!: string
    #status!:Number

    get username() {
        return this.#username
    }
    set username(name) {
       this.#username = name
    }

    get name() {
        return this.#name
    }

    set token(token) {
         this.#token = token;
    }
    get token() {
        return this.#token
    }
    get status() {
        return this.#status
    }


}