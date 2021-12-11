// function replacePlusByADD(node) {
//     // get operands from +
//     var a = node.left,
//         b = node.right;

//     node.type = "CallExpression";
//     node.callee = {
//       "type": "Identifier",
//       "name": "ADD"
//     };
//     node.arguments = [a, b];

//     // reset unnecessary properties
//     node.left = null;
//     node.right = null;
//     node.operator = null;

//     return node;
// }

// estraverse.traverse(ast, {
//     enter: function(node) {
//         if (node.type === "BinaryExpression") {
//             replacePlusByADD(node);
//         }
//     }
// });

    /**
     *   TEST FUNCTIONS / DATA
     */

     const code2 = "function narcissistic(value){ let sum = 0; let splitter = value.toString().split(''); for (let i = 0; i < splitter.length; i++ ) { sum += (parseInt(splitter[i]) ** splitter.length)} if (sum === value){return true} else{ return false }}"
     const func2 = function narcissistic(value){
         let sum = 0
         let splitter = value.toString().split("")
         for (let i = 0; i < splitter.length; i++ ) {
             sum += (parseInt(splitter[i]) ** splitter.length)
         }
         if (sum === value){
             return true
         }
         else {
             return false
         }
     }
     const data2 = 1741725
     // 153, 4150, 548834, 1741725









    /**
     *   FUNCTIONS!
     */

    // array of ints
        function linear(arr) {
            for (let i=0; i<arr.length; i++){
                arr[i]+=1;
            }
        }

        function squared(x) { 
            for(let i=0; i<x.length; i++){ 
                for(let j=0; j<x.length; j++){ 
                    let z = n+n;
                } 
            }
        }

    // int
        function sqrt(num) {
            for (let i=1; i<=Math.sqrt(num); i++){
                if (i**2 === num) {
                    return true;
                }
            }
            return false;
        }


        function constant(n){ return n + n }


        function log(n) {
            let c = 0;
            for (let i = 1; i < n; i = i * 2) {
                c=c+1;
            }
            return c;
        }


        // log(n)
        function binarySearch(arr) {
            let left = 0, right = arr.length-1;
            while (left<=right) {
              let middle = Math.floor((right-left)/2) + left;
              if (arr[middle] === 30) {
                return middle
              }
              else if (arr[middle] < 30) {
                right = middle - 1;
              }
              else {
                right = middle + 1;
              }
            }
        }


        function nLog(n) {
            let c = 0;
            for (let i = 1; i < n; i = i * 2) {
                c=c+1;
            }
            for (let i = 1; i < n; i++) {
                c++;
            }
            return c;
        }


