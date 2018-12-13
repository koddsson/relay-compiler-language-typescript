"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var util = require("util");
function isCreateContainerFunction(fnName) {
    return (fnName === "createFragmentContainer" ||
        fnName === "createRefetchContainer" ||
        fnName === "createPaginationContainer");
}
function isCreateContainerCall(callExpr) {
    var callee = callExpr.expression;
    return ((ts.isIdentifier(callee) && isCreateContainerFunction(callee.text)) ||
        (ts.isPropertyAccessExpression(callee) &&
            ts.isIdentifier(callee.expression) &&
            callee.expression.text === "Relay" &&
            isCreateContainerFunction(callee.name.text)));
}
function createContainerName(callExpr) {
    if (ts.isIdentifier(callExpr.expression) &&
        isCreateContainerFunction(callExpr.expression.text)) {
        return callExpr.expression.text;
    }
    if (ts.isPropertyAccessExpression(callExpr.expression) &&
        ts.isIdentifier(callExpr.expression.expression) &&
        callExpr.expression.expression.text === "Relay") {
        if (isCreateContainerFunction(callExpr.expression.name.text)) {
            return callExpr.expression.name.text;
        }
    }
    throw new Error("Not a relay create container call");
}
function visit(node, addGraphQLTag) {
    function visitNode(node) {
        switch (node.kind) {
            case ts.SyntaxKind.CallExpression: {
                var callExpr_1 = node;
                if (isCreateContainerCall(callExpr_1)) {
                    var fragmentSpec = callExpr_1.arguments[1];
                    if (fragmentSpec == null) {
                        break;
                    }
                    if (ts.isObjectLiteralExpression(fragmentSpec)) {
                        fragmentSpec.properties.forEach(function (prop) {
                            invariant(ts.isPropertyAssignment(prop) &&
                                prop.questionToken == null &&
                                ts.isIdentifier(prop.name) &&
                                ts.isTaggedTemplateExpression(prop.initializer), "FindGraphQLTags: `%s` expects fragment definitions to be " +
                                "`key: graphql`.", createContainerName(callExpr_1));
                            // We tested for this
                            var propAssignment = prop;
                            var taggedTemplate = propAssignment.initializer;
                            invariant(isGraphQLTag(taggedTemplate.tag), "FindGraphQLTags: `%s` expects fragment definitions to be tagged " +
                                "with `graphql`, got `%s`.", createContainerName(callExpr_1), taggedTemplate.tag.getText());
                            addGraphQLTag({
                                keyName: propAssignment.name.text,
                                template: getGraphQLText(taggedTemplate),
                                sourceLocationOffset: getSourceLocationOffset(taggedTemplate)
                            });
                        });
                    }
                    else {
                        invariant(ts.isTaggedTemplateExpression(fragmentSpec), "FindGraphQLTags: `%s` expects a second argument of fragment " +
                            "definitions.", createContainerName(callExpr_1));
                        var taggedTemplate = fragmentSpec;
                        invariant(isGraphQLTag(taggedTemplate.tag), "FindGraphQLTags: `%s` expects fragment definitions to be tagged " +
                            "with `graphql`, got `%s`.", createContainerName(callExpr_1), taggedTemplate.tag.getText());
                        addGraphQLTag({
                            keyName: null,
                            template: getGraphQLText(taggedTemplate),
                            sourceLocationOffset: getSourceLocationOffset(taggedTemplate)
                        });
                    }
                    // Visit remaining arguments
                    for (var i = 2; i < callExpr_1.arguments.length; i++) {
                        visit(callExpr_1.arguments[i], addGraphQLTag);
                    }
                    return;
                }
                break;
            }
            case ts.SyntaxKind.TaggedTemplateExpression: {
                var taggedTemplate = node;
                if (isGraphQLTag(taggedTemplate.tag)) {
                    // TODO: This code previously had no validation and thus no
                    //       keyName/sourceLocationOffset. Are these right?
                    addGraphQLTag({
                        keyName: null,
                        template: getGraphQLText(taggedTemplate),
                        sourceLocationOffset: getSourceLocationOffset(taggedTemplate)
                    });
                }
            }
        }
        ts.forEachChild(node, visitNode);
    }
    visitNode(node);
}
function isGraphQLTag(tag) {
    return (tag.kind === ts.SyntaxKind.Identifier &&
        tag.text === "graphql");
}
function getTemplateNode(quasi) {
    invariant(quasi.template.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral, "FindGraphQLTags: Substitutions are not allowed in graphql tags.");
    return quasi.template;
}
function getGraphQLText(quasi) {
    return getTemplateNode(quasi).text;
}
function getSourceLocationOffset(quasi) {
    var pos = getTemplateNode(quasi).pos;
    var loc = quasi.getSourceFile().getLineAndCharacterOfPosition(pos);
    return {
        line: loc.line + 1,
        column: loc.character + 1
    };
}
function invariant(condition, msg) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (!condition) {
        throw new Error(util.format.apply(util, [msg].concat(args)));
    }
}
exports.find = function (text, filePath) {
    var result = [];
    var ast = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true);
    visit(ast, function (tag) { return result.push(tag); });
    return result;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmluZEdyYXBoUUxUYWdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0ZpbmRHcmFwaFFMVGFncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLCtCQUFpQztBQUNqQywyQkFBNkI7QUFXN0IsbUNBQ0UsTUFBYztJQUtkLE9BQU8sQ0FDTCxNQUFNLEtBQUsseUJBQXlCO1FBQ3BDLE1BQU0sS0FBSyx3QkFBd0I7UUFDbkMsTUFBTSxLQUFLLDJCQUEyQixDQUN2QyxDQUFDO0FBQ0osQ0FBQztBQUVELCtCQUErQixRQUEyQjtJQUN4RCxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDO0lBQ25DLE9BQU8sQ0FDTCxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUkseUJBQXlCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25FLENBQUMsRUFBRSxDQUFDLDBCQUEwQixDQUFDLE1BQU0sQ0FBQztZQUNwQyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDbEMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssT0FBTztZQUNsQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQy9DLENBQUM7QUFDSixDQUFDO0FBRUQsNkJBQ0UsUUFBMkI7SUFLM0IsSUFDRSxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7UUFDcEMseUJBQXlCLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFDbkQ7UUFDQSxPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0tBQ2pDO0lBQ0QsSUFDRSxFQUFFLENBQUMsMEJBQTBCLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztRQUNsRCxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO1FBQy9DLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQy9DO1FBQ0EsSUFBSSx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM1RCxPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztTQUN0QztLQUNGO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFFRCxlQUFlLElBQWEsRUFBRSxhQUF3QztJQUNwRSxtQkFBbUIsSUFBYTtRQUM5QixRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDakIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUNqQyxJQUFNLFVBQVEsR0FBRyxJQUF5QixDQUFDO2dCQUMzQyxJQUFJLHFCQUFxQixDQUFDLFVBQVEsQ0FBQyxFQUFFO29CQUNuQyxJQUFNLFlBQVksR0FBRyxVQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzQyxJQUFJLFlBQVksSUFBSSxJQUFJLEVBQUU7d0JBQ3hCLE1BQU07cUJBQ1A7b0JBQ0QsSUFBSSxFQUFFLENBQUMseUJBQXlCLENBQUMsWUFBWSxDQUFDLEVBQUU7d0JBQzlDLFlBQVksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTs0QkFDbEMsU0FBUyxDQUNQLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7Z0NBQzNCLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSTtnQ0FDMUIsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dDQUMxQixFQUFFLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUNqRCwyREFBMkQ7Z0NBQ3pELGlCQUFpQixFQUNuQixtQkFBbUIsQ0FBQyxVQUFRLENBQUMsQ0FDOUIsQ0FBQzs0QkFFRixxQkFBcUI7NEJBQ3JCLElBQU0sY0FBYyxHQUFHLElBQTZCLENBQUM7NEJBRXJELElBQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQyxXQUEwQyxDQUFDOzRCQUNqRixTQUFTLENBQ1AsWUFBWSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFDaEMsa0VBQWtFO2dDQUNoRSwyQkFBMkIsRUFDN0IsbUJBQW1CLENBQUMsVUFBUSxDQUFDLEVBQzdCLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQzdCLENBQUM7NEJBQ0YsYUFBYSxDQUFDO2dDQUNaLE9BQU8sRUFBRyxjQUFjLENBQUMsSUFBc0IsQ0FBQyxJQUFJO2dDQUNwRCxRQUFRLEVBQUUsY0FBYyxDQUFDLGNBQWMsQ0FBQztnQ0FDeEMsb0JBQW9CLEVBQUUsdUJBQXVCLENBQUMsY0FBYyxDQUFDOzZCQUM5RCxDQUFDLENBQUM7d0JBQ0wsQ0FBQyxDQUFDLENBQUM7cUJBQ0o7eUJBQU07d0JBQ0wsU0FBUyxDQUNQLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxZQUFZLENBQUMsRUFDM0MsOERBQThEOzRCQUM1RCxjQUFjLEVBQ2hCLG1CQUFtQixDQUFDLFVBQVEsQ0FBQyxDQUM5QixDQUFDO3dCQUNGLElBQU0sY0FBYyxHQUFHLFlBQTJDLENBQUM7d0JBQ25FLFNBQVMsQ0FDUCxZQUFZLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUNoQyxrRUFBa0U7NEJBQ2hFLDJCQUEyQixFQUM3QixtQkFBbUIsQ0FBQyxVQUFRLENBQUMsRUFDN0IsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FDN0IsQ0FBQzt3QkFDRixhQUFhLENBQUM7NEJBQ1osT0FBTyxFQUFFLElBQUk7NEJBQ2IsUUFBUSxFQUFFLGNBQWMsQ0FBQyxjQUFjLENBQUM7NEJBQ3hDLG9CQUFvQixFQUFFLHVCQUF1QixDQUFDLGNBQWMsQ0FBQzt5QkFDOUQsQ0FBQyxDQUFDO3FCQUNKO29CQUNELDRCQUE0QjtvQkFDNUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUNsRCxLQUFLLENBQUMsVUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztxQkFDN0M7b0JBQ0QsT0FBTztpQkFDUjtnQkFDRCxNQUFNO2FBQ1A7WUFDRCxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFDM0MsSUFBTSxjQUFjLEdBQUcsSUFBbUMsQ0FBQztnQkFDM0QsSUFBSSxZQUFZLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNwQywyREFBMkQ7b0JBQzNELHVEQUF1RDtvQkFDdkQsYUFBYSxDQUFDO3dCQUNaLE9BQU8sRUFBRSxJQUFJO3dCQUNiLFFBQVEsRUFBRSxjQUFjLENBQUMsY0FBYyxDQUFDO3dCQUN4QyxvQkFBb0IsRUFBRSx1QkFBdUIsQ0FBQyxjQUFjLENBQUM7cUJBQzlELENBQUMsQ0FBQztpQkFDSjthQUNGO1NBQ0Y7UUFDRCxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xCLENBQUM7QUFFRCxzQkFBc0IsR0FBWTtJQUNoQyxPQUFPLENBQ0wsR0FBRyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVU7UUFDcEMsR0FBcUIsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUMxQyxDQUFDO0FBQ0osQ0FBQztBQUVELHlCQUNFLEtBQWtDO0lBRWxDLFNBQVMsQ0FDUCxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLDZCQUE2QixFQUNuRSxpRUFBaUUsQ0FDbEUsQ0FBQztJQUNGLE9BQU8sS0FBSyxDQUFDLFFBQTRDLENBQUM7QUFDNUQsQ0FBQztBQUVELHdCQUF3QixLQUFrQztJQUN4RCxPQUFPLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDckMsQ0FBQztBQUVELGlDQUFpQyxLQUFrQztJQUNqRSxJQUFNLEdBQUcsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ3ZDLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyRSxPQUFPO1FBQ0wsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUNsQixNQUFNLEVBQUUsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDO0tBQzFCLENBQUM7QUFDSixDQUFDO0FBRUQsbUJBQW1CLFNBQWtCLEVBQUUsR0FBVztJQUFFLGNBQWM7U0FBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1FBQWQsNkJBQWM7O0lBQ2hFLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLE9BQVgsSUFBSSxHQUFRLEdBQUcsU0FBSyxJQUFJLEdBQUUsQ0FBQztLQUM1QztBQUNILENBQUM7QUFFWSxRQUFBLElBQUksR0FBcUIsVUFBQyxJQUFJLEVBQUUsUUFBUTtJQUNuRCxJQUFNLE1BQU0sR0FBaUIsRUFBRSxDQUFDO0lBQ2hDLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlFLEtBQUssQ0FBQyxHQUFHLEVBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFoQixDQUFnQixDQUFDLENBQUM7SUFDcEMsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDIn0=