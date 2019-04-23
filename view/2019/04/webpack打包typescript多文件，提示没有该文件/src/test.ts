import A from './a';

console.log(A.yourName);

export default class Test {
    private name: string = 'abc';
    showName () {
        console.log(this.name);
    }
}