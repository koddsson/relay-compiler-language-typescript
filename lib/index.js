"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FindGraphQLTags_1 = require("./FindGraphQLTags");
var formatGeneratedModule_1 = require("./formatGeneratedModule");
var TypeScriptGenerator = require("./TypeScriptGenerator");
function plugin() {
    return {
        inputExtensions: ["ts", "tsx"],
        outputExtension: "ts",
        findGraphQLTags: FindGraphQLTags_1.find,
        formatModule: formatGeneratedModule_1.formatGeneratedModule,
        typeGenerator: TypeScriptGenerator
    };
}
exports.default = plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxxREFBeUM7QUFDekMsaUVBQWdFO0FBQ2hFLDJEQUE2RDtBQUU3RDtJQUNFLE9BQU87UUFDTCxlQUFlLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1FBQzlCLGVBQWUsRUFBRSxJQUFJO1FBQ3JCLGVBQWUsRUFBRSxzQkFBSTtRQUNyQixZQUFZLEVBQUUsNkNBQXFCO1FBQ25DLGFBQWEsRUFBRSxtQkFBbUI7S0FDbkMsQ0FBQztBQUNKLENBQUM7QUFSRCx5QkFRQyJ9