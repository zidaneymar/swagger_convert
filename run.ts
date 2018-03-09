
import * as fs from "fs";

import {resolve} from "path";

import * as TJS from "typescript-json-schema";

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
    required: true
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true
}

// optionally pass a base path
const basePath = "./";

const program = TJS.getProgramFromFiles([resolve("microsoft-graph.d.ts")], compilerOptions, basePath);

// We can either get the schema for one file and one type...
//  const schema = TJS.generateSchema(program, "*", settings);

// console.log(schema);
// ... or a generator that lets us incrementally get more schemas

const generator = TJS.buildGenerator(program, settings);
if (generator) {

// // all symbols
const symbols = generator.getUserSymbols();

// console.log(symbols);
let a = 0
let definitions: any[] = [];
// let one = symbols[100];

// console.log(one);
// let set = new Set();
symbols.forEach(one => {
    
        let resultStr = generator.getSchemaForSymbol(one);
        if (resultStr.type && resultStr.type === "object") {
            // definitions.push(resultStr.definitions);
            // console.log(resultStr);
            definitions.push(
                {
                    [one]:
                    {
                        type: "object",
                        properties: resultStr.properties
                    }
                });
       
    }
    if (resultStr.definitions){
        Object.keys(resultStr.definitions).forEach(key => {
            definitions.push(resultStr.definitions[key]);
        })
    }
    
});


fs.writeFile('output.json', JSON.stringify(definitions), (err) => {
    console.log(err);
})
}

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

