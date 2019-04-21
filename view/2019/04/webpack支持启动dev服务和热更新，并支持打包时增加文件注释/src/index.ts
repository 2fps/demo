class A {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }
    showName() {
        console.log(this.name);
    }
}

export default A;