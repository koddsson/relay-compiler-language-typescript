"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatGeneratedModule = function (_a) {
    var moduleName = _a.moduleName, documentType = _a.documentType, docText = _a.docText, concreteText = _a.concreteText, typeText = _a.typeText, hash = _a.hash, _b = _a.relayRuntimeModule, relayRuntimeModule = _b === void 0 ? "relay-runtime" : _b, sourceHash = _a.sourceHash;
    var documentTypeImport = documentType
        ? "import { " + documentType + " } from \"" + relayRuntimeModule + "\";"
        : "";
    var docTextComment = docText ? "\n/*\n" + docText.trim() + "\n*/\n" : "";
    return "/* tslint:disable */\n\n" + documentTypeImport + "\n" + (typeText || "") + "\n\n" + docTextComment + "\nconst node: " + (documentType || "never") + " = " + concreteText + ";\n(node as any).hash = '" + sourceHash + "';\nexport default node;\n";
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0R2VuZXJhdGVkTW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Zvcm1hdEdlbmVyYXRlZE1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVhLFFBQUEscUJBQXFCLEdBQWlCLFVBQUMsRUFTbkQ7UUFSQywwQkFBVSxFQUNWLDhCQUFZLEVBQ1osb0JBQU8sRUFDUCw4QkFBWSxFQUNaLHNCQUFRLEVBQ1IsY0FBSSxFQUNKLDBCQUFvQyxFQUFwQyx5REFBb0MsRUFDcEMsMEJBQVU7SUFFVixJQUFNLGtCQUFrQixHQUFHLFlBQVk7UUFDckMsQ0FBQyxDQUFDLGNBQVksWUFBWSxrQkFBWSxrQkFBa0IsUUFBSTtRQUM1RCxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ1AsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzNFLE9BQU8sNkJBRVAsa0JBQWtCLFdBQ2xCLFFBQVEsSUFBSSxFQUFFLGFBRWQsY0FBYyx1QkFDRixZQUFZLElBQUksT0FBTyxZQUFNLFlBQVksaUNBQy9CLFVBQVUsK0JBRWpDLENBQUM7QUFDRixDQUFDLENBQUMifQ==