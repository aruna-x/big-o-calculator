/**
 *   REQUIRES
 */ 

const esprima = require('esprima');
const escodegen = require('escodegen');
const estraverse = require('estraverse');

function getBigO(dataType, code){
    // Char sets
    // const alnum = 'abcdefghijklmnopqrstuvwxyz0123456789';
    // const alpha = 'abcdefghijklmnopqrstuvwxyz';
    // const num = '0123456789';

    // Declare data sets
        let sets = [];
        let n = [32, 64, 128, 256, 512];

    // Populate data sets
        switch(dataType) {
            case "integer":
                sets = n;
                break;
            // case "int-length-matters":
            //     sets = n;
            //     n = [2,2,3,3,3,4,4,4];
            //     break;
            // case "alpha-str":
            // case "alpha-num-str":
            // case "alpha-num-spec-str":
            case "array-ints":
                for (let i=0; i<n.length; i++){
                    let arr = [];
                    for (let j=0; j<n[i]; j++) {
                        arr.push(Math.floor(Math.random()*9))
                    }
                    sets[i] = arr;
                }
                break;
            // case "array-rand-str":
            default:
                break;
        }

    //What if they do not use ; and the string that's sent to here includes \n ... something like "function foo() {let sum=0\n let splitter = value.toString().split("") .... etc.}"
    //what if they use "" in the code 
    //what about +=, -=
    
    // BUILD AST 

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
        
        // console.log(counters)
        console.log(counters[counters.length-1]-counters[counters.length-2])
        console.log(counters[counters.length-2]-counters[counters.length-3])
        let bigOEst;
        if ((counters[counters.length-1] - counters[counters.length-2]) === 0) {
            bigOEst = "O(1)";
        }
        // I can do this because I've made the data sets successively double in size
        else if ((counters[counters.length-1] - counters[counters.length-2]) === (counters[counters.length-2] - counters[counters.length-3])) {
            bigOEst = "O(log(n))";
        }
        // dividing by the *difference between the last 2 ns*, then making sure the result is less than that difference, ensures that this isn't a power of n
        else if ((counters[counters.length-1] - counters[counters.length-2]) / (n[counters.length-1] - n[counters.length-2]) < n[counters.length-1] - n[counters.length-2]) {
            // if (((counters[counters.length-1] - counters[counters.length-2]) / (n[counters.length-1] - n[counters.length-2]))/Math.log(n[counters.length-1] - n[counters.length-2]) < n[counters.length-1] - n[counters.length-2]){
            //     bigOEst = "O(nlog(n))";
            // }
            // else {
                bigOEst = "O(n)";
            // }
            console.log('counter:', counters)
            console.log('n:', n)
        }
        else if ((counters[counters.length-1] - counters[counters.length-2]) / (n[counters.length-1] - n[counters.length-2]) >= n[counters.length-1] - n[counters.length-2]) {
            bigOEst = "O(n^2)";
        }
        // else if (counters[counters.length-2]-counters[counters.length-3] > counters[counters.length-1]-counters[counters.length-2]){
        //     console.log("sublinear!")
        // }
        // else if (counters[counters.length-2]-counters[counters.length-3] < counters[counters.length-1]-counters[counters.length-2]){
        //     console.log("Here!")
        // }
        // else {
        //     // make big o array
        //     // ADD: log(n) and (2^n)
        //     const ratioArr = [];
        //     for (let i=0; i<n.length; i++) {
        //         let tempArr=[];
        //         tempArr.push();
        //         tempArr.push(Math.abs(1 - counters[i] / Math.log(n[i])));
        //         tempArr.push(Math.abs(1 - counters[i] / n[i]**0.5));
        //         tempArr.push(Math.abs(1 - counters[i] / n[i]));
        //         tempArr.push(Math.abs(1 - counters[i] / n[i]*Math.log(n[i])));
        //         tempArr.push(Math.abs(1 - counters[i] / n[i]**2));
        //         ratioArr.push(tempArr);
        //     }

        //     for(let i=0;i<n.length; i++){
        //         console.log('counter:',counters[i])
        //         console.log('n:', n[i])
        //         console.log('ratioArr:', ratioArr[i])
        //     }

        //     // console.log(ratioArr)
        //     let closestMatch = 0;
        //     for (let i=0; i<ratioArr[1].length; i++) {
        //         if (ratioArr[1][i] < ratioArr[1][closestMatch]){
        //             closestMatch = i;
        //         }
        //     }

            // let est; 
            // switch(closestMatch) {
            //     case 0:
            //         est = "log(n)";
            //         break;
            //     case 1:
            //         est = "n^(1/2)"
            //         break;
            //     case 2:
            //         est = "n"
            //         break;
            //     case 3:
            //         est = "n * log(n)"
            //         break;
            //     case 4:
            //         est = "n^2"
            //         break;
            //     default:
            //         let error = "There was an error, try again!";
            //         break;
            // }
            // bigOEst = `O(${est})`;
        // }

    // RETURN :   {error, bigO estimate, hottest lines}
    return {error: "none", bigOEst: bigOEst, hotLines: ["Coming Soon"]}
}


export { esprima, escodegen, estraverse, getBigO }