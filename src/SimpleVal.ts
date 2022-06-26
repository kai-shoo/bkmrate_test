export const string = () => {
    return new StringSchema;
}

type CustomErrorType = {
    message: string;
}


const rPhone = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g

export class StringSchema{
    private pipe: ((...args: any[]) => void)[] = [];

    public validate = (target: any): string | undefined=> {
        try {
            this.pipe.forEach((f: any) => { f(target) })
        } catch (err) {
            const error = err as CustomErrorType;
            return error.message;
        }
    }

    public min(value: number, errorMessage?: string) {
        this.pipe.push((target: string) => {
            if (target.length < value) throw new Error(errorMessage || `String must be at least ${value} characters`)
        })
        return this;
    }

    public max(value: number, errorMessage?: string) {
        this.pipe.push((target: string) => {
            if (target.length > value) throw new Error(errorMessage || `String must be at max ${value} characters`)
        })
        return this;
    }

    public isPhone(errorMessage?: string) {
        this.pipe.push((target: string) => {
            if(!target.match(rPhone)) throw new Error(errorMessage || `Phone is incorrect`)
        })
        return this;
    }

    public matches(regexp: RegExp, errorMessage?: string) {
        this.pipe.push((target: string) => {
            if(!target.match(regexp)) throw new Error(errorMessage || `Does not match pattern`)
        })
        return this;
    }

    public required(errorMessage?: string) {
        this.pipe.push((target: string) => {
            if(target.length === 0) throw new Error(errorMessage || `Required`)
        })
        return this;
    }
}
