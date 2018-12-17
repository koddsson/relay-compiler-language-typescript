"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var graphql_1 = require("graphql");
function getInputObjectTypeIdentifier(type) {
    return type.name;
}
function transformScalarType(type, state, objectProps) {
    if (type instanceof graphql_1.GraphQLNonNull) {
        return transformNonNullableScalarType(type.ofType, state, objectProps);
    }
    else {
        return ts.createUnionTypeNode([
            transformNonNullableScalarType(type, state, objectProps),
            ts.createKeywordTypeNode(ts.SyntaxKind.NullKeyword)
        ]);
    }
}
exports.transformScalarType = transformScalarType;
function transformNonNullableScalarType(type, state, objectProps) {
    if (type instanceof graphql_1.GraphQLList) {
        return ts.createTypeReferenceNode(ts.createIdentifier("ReadonlyArray"), [
            transformScalarType(type.ofType, state, objectProps)
        ]);
    }
    else if (type instanceof graphql_1.GraphQLObjectType ||
        type instanceof graphql_1.GraphQLUnionType ||
        type instanceof graphql_1.GraphQLInterfaceType) {
        return objectProps;
    }
    else if (type instanceof graphql_1.GraphQLScalarType) {
        return transformGraphQLScalarType(type, state);
    }
    else if (type instanceof graphql_1.GraphQLEnumType) {
        return transformGraphQLEnumType(type, state);
    }
    else {
        throw new Error("Could not convert from GraphQL type " + type.toString());
    }
}
function transformGraphQLScalarType(type, state) {
    switch (state.customScalars[type.name] || type.name) {
        case "ID":
        case "String":
        case "Url":
            return ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
        case "Float":
        case "Int":
            return ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
        case "Boolean":
            return ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
        default:
            return ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
    }
}
function transformGraphQLEnumType(type, state) {
    state.usedEnums[type.name] = type;
    return ts.createTypeReferenceNode(ts.createIdentifier(type.name), []);
}
function transformInputType(type, state) {
    if (type instanceof graphql_1.GraphQLNonNull) {
        return transformNonNullableInputType(type.ofType, state);
    }
    else {
        return ts.createUnionTypeNode([
            transformNonNullableInputType(type, state),
            ts.createKeywordTypeNode(ts.SyntaxKind.NullKeyword)
        ]);
    }
}
exports.transformInputType = transformInputType;
function transformNonNullableInputType(type, state) {
    if (type instanceof graphql_1.GraphQLList) {
        return ts.createTypeReferenceNode(ts.createIdentifier("ReadonlyArray"), [
            transformInputType(type.ofType, state)
        ]);
    }
    else if (type instanceof graphql_1.GraphQLScalarType) {
        return transformGraphQLScalarType(type, state);
    }
    else if (type instanceof graphql_1.GraphQLEnumType) {
        return transformGraphQLEnumType(type, state);
    }
    else if (type instanceof graphql_1.GraphQLInputObjectType) {
        var typeIdentifier = getInputObjectTypeIdentifier(type);
        if (state.generatedInputObjectTypes[typeIdentifier]) {
            return ts.createTypeReferenceNode(ts.createIdentifier(typeIdentifier), []);
        }
        state.generatedInputObjectTypes[typeIdentifier] = "pending";
        var fields_1 = type.getFields();
        var props = Object.keys(fields_1)
            .map(function (key) { return fields_1[key]; })
            .filter(function (field) {
            return state.optionalInputFields &&
                state.optionalInputFields.indexOf(field.name) < 0;
        })
            .map(function (field) {
            var property = ts.createPropertySignature([ts.createToken(ts.SyntaxKind.ReadonlyKeyword)], ts.createIdentifier(field.name), !(field.type instanceof graphql_1.GraphQLNonNull)
                ? ts.createToken(ts.SyntaxKind.QuestionToken)
                : undefined, transformInputType(field.type, state), undefined);
            return property;
        });
        state.generatedInputObjectTypes[typeIdentifier] = ts.createTypeLiteralNode(props);
        return ts.createTypeReferenceNode(ts.createIdentifier(typeIdentifier), []);
    }
    else {
        throw new Error("Could not convert from GraphQL type " + type.toString());
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZVNjcmlwdFR5cGVUcmFuc2Zvcm1lcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVHlwZVNjcmlwdFR5cGVUcmFuc2Zvcm1lcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFFakMsbUNBV2lCO0FBaUJqQixzQ0FBc0MsSUFBNEI7SUFDaEUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ25CLENBQUM7QUFFRCw2QkFDRSxJQUFpQixFQUNqQixLQUFZLEVBQ1osV0FBeUI7SUFFekIsSUFBSSxJQUFJLFlBQVksd0JBQWMsRUFBRTtRQUNsQyxPQUFPLDhCQUE4QixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0tBQ3hFO1NBQU07UUFDTCxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztZQUM1Qiw4QkFBOEIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQztZQUN4RCxFQUFFLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7U0FDcEQsQ0FBQyxDQUFDO0tBQ0o7QUFDSCxDQUFDO0FBYkQsa0RBYUM7QUFFRCx3Q0FDRSxJQUFpQixFQUNqQixLQUFZLEVBQ1osV0FBeUI7SUFFekIsSUFBSSxJQUFJLFlBQVkscUJBQVcsRUFBRTtRQUMvQixPQUFPLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDdEUsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDO1NBQ3JELENBQUMsQ0FBQztLQUNKO1NBQU0sSUFDTCxJQUFJLFlBQVksMkJBQWlCO1FBQ2pDLElBQUksWUFBWSwwQkFBZ0I7UUFDaEMsSUFBSSxZQUFZLDhCQUFvQixFQUNwQztRQUNBLE9BQU8sV0FBWSxDQUFDO0tBQ3JCO1NBQU0sSUFBSSxJQUFJ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