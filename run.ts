
import * as fs from "fs";

import {resolve} from "path";

import * as TJS from "typescript-json-schema";

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
    required: true,
    ref: true,
    strictNullChecks: true,
    titles: true,
    topRef: true
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: false,
    // refs: true,
    // titles: true
}
let store = new Set<string>();
// optionally pass a base path
const basePath = "./";

const program = TJS.getProgramFromFiles([resolve("microsoft-graph.d.ts")], compilerOptions, basePath);

// We can either get the schema for one file and one type...
//  const schema = TJS.generateSchema(program, "*", settings);

// console.log(schema);
// ... or a generator that lets us incrementally get more schemas

const generator = TJS.buildGenerator(program, settings);
// // all symbols
// let symbols = generator.getUserSymbols();

// console.log(symbols);
let a = 0
let definitions = {};
// let one = symbols[100];

// console.log(one);
// let set = new Set();
let symbols = ["User"];

// fs.writeFile('symbols.txt', JSON.stringify(symbols), (err) => {
    
//     console.log(`HHHHH${err}`);
// })

let resultStr = generator.getSchemaForSymbols(symbols);
        // let resultStr = TJS.generateSchema(program, one, settings);
    //     if (resultStr.type && resultStr.type === "object") {
    //         // definitions.push(resultStr.definitions);
    //         // console.log(resultStr);
    //         if (!store.has(one)) {
    //             definitions.push(
    //                 {
    //                     [one]:
    //                     {
    //                         type: "object",
    //                         properties: resultStr.properties
    //                     }
    //                 });
    //             store.add(one);
    //         }
    // }

if (resultStr.definitions){
    Object.keys(resultStr.definitions).forEach(key => {
        if (!store.has(key) && resultStr.definitions[key].type === "object") {
            let curDefi = resultStr.definitions[key];
            // curDefi["title"] = key;
            definitions[key] = curDefi;
            
            store.add(key);
        }
        
    })
}

console.log(definitions);

fs.writeFile('output.json', JSON.stringify(definitions), (err) => {
    
    console.log(`HHHHH${err}`);
})


// console.log(definitions[0]);
// console.log(definitions[definitions.length - 1]);

// console.log(definitions.length);


// symbols.forEach(element => {
//     console.log(element);
//     let resultStr = generator.getSchemaForSymbol(element)
//     let resultJSON = JSON.parse(resultStr);
//     // definitions.push(`{
//     //     ${element} : {
//     //     }
//     // })
//     const father = {
//         type: 'object',
//         properties: resultJSON["properties"]
//     };
//     console.log(father);

//     a++;
//     console.log(a);
// });

// Get symbols for different types from generator.
// generator.getSchemaForSymbol("MyType");
// generator.getSchemaForSymbol("AnotherType");

