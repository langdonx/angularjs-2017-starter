import {Calculator} from './test';

describe('Calculator', () => {
   it('should add two numbers', () => {
       let calculator = new Calculator();
       let sum = calculator.add(1,4);
       expect(sum).toBe(5);
   });
});

describe("A suite is just a function", function() {
  var a;

  it("and so is a spec", function() {
    a = true;

    expect(a).toBe(true);
  });

  it('returns 1', function(){
      var $injector = angular.injector([ 'app' ]);
      var myService = $injector.get( 'myService' );
      expect( myService.one ).toEqual(1);
  })
});