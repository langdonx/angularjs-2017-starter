export default class {
    constructor($q, $scope) {
        'ngInject';

        Object.assign(this, { $q, $scope });

        this.testResult = '';
    }

    // ES2016
    testArrayIncludes() {
        const arr = ['asdf', 'qwerty', 'test'];

        this.testResult = `Array Source: ${JSON.stringify(arr)}

arr.includes('qwerty'): ${arr.includes('qwerty')}
arr.includes('none'): ${arr.includes('none')}`;
    }

    // ES2016
    testExponentiationOperator() {
        // eslint-disable-next-line no-restricted-properties
        this.testResult = `Math.pow(2, 10): ${Math.pow(2, 10)}
2 ** 10: ${2 ** 10}`;
    }

    // ES2017
    testObjectEntries() {
        const obj = {
            a: true,
            b: false,
            c: 'hello',
            d: 31337,
            e: null,
        };

        this.testResult = `Object Source: ${JSON.stringify(obj)}

Object.entries: ${JSON.stringify(Object.entries(obj))}
Object.values: ${JSON.stringify(Object.values(obj))}`;
    }

    // ES2017
    testStringPadStart() {
        const s = 'hello world';

        this.testResult = `String Source: ${s}

padStart(15, 'z'): ${s.padStart(15, 'zz')}
padEnd(15, 'z'): ${s.padEnd(15, 'zz')}
padStart(15, '1234567890'): ${s.padStart(15, '1234567890')}
padStart(15, '123'): ${s.padStart(15, '123')}`;
    }

    // ES2017
    testAsyncFunctions() {
        // if you want to use the await keyboard, you must be inside of an async scope
        (async () => {
            // declared functions can be async
            async function classicFunctionGetSomething() {
                return new this.$q((resolve) => {
                    setTimeout(() => resolve('result from classic function'), 2000);
                });
            }

            // arrow functions can be async
            const arrowFunctionGetSomething = async () => new this.$q((resolve) => {
                setTimeout(() => resolve('result from arrow function'), 2000);
            });

            // class methods can be async
            class Test {
                constructor($q) {
                    this.$q = $q;
                }

                async getSomething() {
                    return new this.$q((resolve) => {
                        setTimeout(() => resolve('result from class method'), 2000);
                    });
                }
            }

            // unfortunately await doesn't work well at all with AngularJS if you're trying to bind back to the ui... (3x $apply)
            this.testResult = 'Awaiting Class Method: ';
            this.testResult += await new Test(this.$q).getSomething();
            this.testResult += '\n\n';
            this.testResult += 'Awaiting Classic Function: ';
            this.$scope.$apply();
            this.testResult += await classicFunctionGetSomething.bind(this)();
            this.testResult += '\n\n';
            this.testResult += 'Awaiting Arrow Function: ';
            this.$scope.$apply();
            this.testResult += await arrowFunctionGetSomething.bind(this)();
            this.$scope.$apply();
        })();
    }
}
