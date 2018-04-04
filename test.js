var listMethods = require('list-methods')
var fs = require('fs')
var functionExtractor = require('function-extractor')
var escomplex = require('escomplex')
var diff = require('deep-diff')

var source = fs.readFileSync('esprima.js', 'utf8')
var source2 = fs.readFileSync('esprima2.js', 'utf8')

var functions = functionExtractor.parse(source)
var functions2 = functionExtractor.parse(source2)
var result = escomplex.analyse(source,null)

console.log(result.functions)
// for (i in functions) {
//   console.log(functions[i])
//   // console.log('--------------------')
//   // if(functions[i].params.length === 0) {
//   //   console.log('NO PARAMS')
//   // }
//   // else {
//   //   for (j in functions[i].params) {
//   //       console.log(`Param ${eval(j+1)}: ${functions[i].params[j].name}`)
//   //   }
//   // }
//   //
//   console.log()
// }
//
// //var differences = diff(functions[0], functions2[0])
//
// var destination = fs.createWriteStream('ListOfMethods2.txt')
// destination.on('error', function(err) { /* error handling */ });
// //
// // console.log(result.functions)
// for(i in functions) {
//   destination.write(functions[i].name + '\n--------------------\n')
//   if(functions[i].params.length === 0) {
//     destination.write('NO PARAMS\n')
//   }
//   else {
//     for (j in functions[i].params) {
//         var tmpSum = parseInt(j) + 1
//         destination.write(`Param ${tmpSum}: ${functions[i].params[j].name}\n`)
//     }
//   }
//   destination.write('\n')
// }

// for(i in result) {
//   console.log(result[i])
//   console.log('----')
//   destination.write(result[i].toString())
//   destination.write('---')
// }

//console.log(differences)

// for(i in functions){
//   console.log('------')
//   console.log(functions[i].name)
//   for(j in functions[i].params){
//     console.log(functions[i].params[j])
//   }
// }
