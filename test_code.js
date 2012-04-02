function Dog() {
    this.occupation = 'Ninja',
    this.street_address = 'Test',

    this.greet = function() {
      return 'Hello world';
    }

    this.dontgreet = function() {
      return 'hello world';
  }
}
  
// ---------------------------------------
  
Object.prototype.inObj = 1;
 
function A()
{
    this.inA = 2;
}
 
A.prototype.inAProto = 3;
 
B.prototype = new A;            // Hook up A into B's prototype chain
B.prototype.constructor = B;
function B()
{
    this.inB = 4;
}
 
B.prototype.inBProto = 5;
 
x = new B;

-------------------------------------------------------------------

var MyScene = {
    greet: "Hello World",
    myVar: 5.6,

    hello: function () {
        alert("hello");
    },
};
