/**
 *   REQUIRES
 */ 

const esprima = require('esprima');
const escodegen = require('escodegen');
const estraverse = require('estraverse');

function getBigO(dataType, code){

    // Default for error
        let error = "none";

    // Char sets
        const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        // const alnum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        // const num = '0123456789';

    // Declare data sets
        let sets = [];
        let n = [ 256, 512, 1024, 2048, 4096];
        //64, 128,

    // Populate data sets
        switch(dataType) {

            case "integer":
                sets = n;
                break;

            case "array-ints":
                for (let i=0; i<n.length; i++){
                    let arr = [];
                    for (let j=0; j<n[i]; j++) {
                        arr.push(Math.floor(Math.random()*9))
                    }
                    sets[i] = arr;
                }
                break;

            case "string":
                for (let i=0; i<n.length; i++){
                    let str = '';
                    for (let j=0; j<n[i]; j++) {
                        str += alpha.charAt(Math.floor(Math.random() * alpha.length));
                    }
                    sets[i] = str;
                }
                break;

            case "array-strs":
                for (let i=0; i<n.length; i++){
                    let count = n[i];
                    let arr = [];
                    while (count>0) {
                        let str = '';
                        for (let j=0; j<n[i]; j++){
                            str += alpha.charAt(Math.floor(Math.random() * alpha.length));
                        }
                        arr.push(str);
                        count--;
                    }
                    sets[i] = arr;
                }
                break;

            default:
                break;
        }

    //What if they do not use ; and the string that's sent to here includes \n ... something like "function foo() {let sum=0\n let splitter = value.toString().split("") .... etc.}"
    //what if they use "" in the code 
    //what about +=, -=
    
    // CREATE AST

        const ast = esprima.parse(`${code}`);

    // MODIFY AST

        estraverse.traverse(ast, {
            enter: function(node) {
                if (node.type === "BlockStatement") {
                    injectBlockStatements(node);
                }
            }
        });


        // MUST change arrow functions to named functions because the parser add ; to the end of an arrow function (donno why?!) and i'm unable to immediately invoke

        function injectBlockStatements(node) {
            let addCounter = {
                type: 'ExpressionStatement', 
                expression: {
                    type:'AssignmentExpression',
                    left: {name: 'counter', type: 'Identifier'},
                    operator: '+=',
                    right: {value: 1, type: 'Literal'}
                }
            }
            return node.body.unshift(addCounter)
        }


    // CODE GEN / UNPARSE

        const modified = escodegen.generate(ast).replaceAll("\n", "");


    //  CALCULATE BIG O APPROX

        // grab counters
        const counters = [];
        for (let i=0; i<n.length; i++) {
            counters.push(eval(`(()=>{
                let counter = 0; 
                (${modified})(sets[${i}]); 
                return counter;
                })()`)
            );
        }
        
        let c1 = counters[counters.length-1];
        let c2 = counters[counters.length-2];
        let c3 = counters[counters.length-3];

        let n1 = n[counters.length-1];
        let n2 = n[counters.length-2];
        let n3 = n[counters.length-3];

        console.log("n", n);
        console.log("counters", counters);

        let bigOEst;

        if ((c1 - c2) === 0) {
            bigOEst = "O(1)";
        }
        // Can do this because data sets successively double in size
        else if ((c1 - c2) === (c2 - c3)) {
            bigOEst = "O(log(n))";
        }

        /**
         * ADD sqrt(n)
         */

        // dividing by the *difference between the last 2 ns*, then making sure the result is less than that difference, ensures that this isn't a power of n
        else if ((c1 - c2) / (n1 - n2) < n1 - n2) {
            bigOEst = "O(n)";
        }

        /**
         * ADD nlog(n)
         */

        // This accounts for multiples of n^2, but not n^3 or more :)
        else if(((c1-c2)/(n1 - n2)) / (2*((c2-c3)/(n2 - n3))) <= 1){
            bigOEst = "O(n^2)";
        }
        else {
            error = "Looks like the function you entered has n^3 or greater time!"
        }

    return {error: error, bigOEst: bigOEst, hotLines: ["Coming Soon"]}
}


export { esprima, escodegen, estraverse, getBigO }