const css = require('css');
const EOF = Symbol("EOF");

let currentToken = null;
let currentAttribute = null;
let stack = [{type:"document",children:[]}];
let currentTextNode = null;

let rules = [];
function addCSSRules(text){
    var ast = css.parse(text);
    rules.push(...ast.stylesheet.rules);
}

function computeCSS(element){
    var elements = stack.slice().reverse();
}

function emit(token){
    if(token.type!="text"){
        return;
    }
    let top = stack[stack.length -1];

    if(token.type == "startTag"){
        let element = {
            type:"element",
            children:[],
            attributes:[]
        };

        element.tagName = token.tagName;
        
        for(let p in token){
            if(p != "type" && p != "tagName"){
                element.attributes.push({
                    name:p,
                    value:token[p]
                });
            }
        }

        computeCSS(element);

        top.children.push(element);
        element.parent = top;

        if(!token.isSelfClosing){
            stack.push(element);
        }
        currentTextNode = null;

    }else if(token.type == "endTag"){
        if(top.tagName != token.tagName){
            throw new Error("Tag start end doesn't match!");
        }else {
            // 遇到style标签，执行添加CSS规则的操作
            if(top.tagName == "style"){
                addCSSRules(top.children[0].content);
            }
            stack.pop();
        }
        currentTextNode = null;

    }else if(token.type == "text"){
        if(currentTextNode == null){
            currentTextNode = {
                type :"text",
                content:""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

function data(c){
    if(c == "<"){
        return tagOpen;
    }else if(c == EOF){
        emit({
            type:"EOF"
        });
        return;
    }else{
        emit({
            type:"text",
            content:c
        });
        return data;
    }
}

function tagOpen(c){
    if(c == "/"){
        return endTagOpen;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type:"startTag",
            tagName:""
        }
        return tagName(c);
    }else{
        return;
    }
}

function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type:"endTag",
            tagName:""
        }
        return tagName(c);
    }else if(c == ">"){

    }else if(c == EOF){

    }else{

    }
}

function tagName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c == "/"){
        return selfClosingStartTag;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken.tagName += c//.toLowerCase();
        return tagName;
    }else if(c == ">"){
        emit(currentToken);
        return data;
    }else{
        return tagName;
    }
}

function beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c == "/" || c == ">" || c == EOF){
        return afterAttributeName(c);
    }else if(c == "="){
        
    }else{
        currentAttribute = {
            name:"",
            value:""
        }
        return attributeName(c);
    }
}

function attributeName(c){
    if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF){
        return afterAttributeName(c);
    }else if(c == "="){
        return beforeAttributeValue;
    }else if(c == "\u0000"){

    }else if(c == "\"" || c == "'" || c == "<"){

    }else {
        currentAttribute.name += c;
        return attributeName;
    }
}

function beforeAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF){
        return beforeAttributeValue(c);
    }else if(c == "\""){
        return doubleQuotedAttributeValue;
    }else if(c == "\""){
        return singleQuotedAttributeValue;
    }else if(c == ">"){

    }else {
        return UnquotedAttributeValue(c);
    }
}

function doubleQuotedAttributeValue(c){
    if(c == "\""){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    }else if(c == "\u0000"){

    }else if(c == EOF){

    }else{
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c){
    if(c == "\'"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    }else if(c == "\u0000"){

    }else if(c == EOF){

    }else{
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function UnquotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    }else if(c == "/"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    }else if(c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c == "\u0000"){

    }else if(c == "\"" || c == "'" || c == "<" || c == "=" || c == "`"){

    }else if(c == EOF){

    }else{
        currentAttribute.value += c;
        return UnquotedAttributeValue;
    }
}

function selfClosingStartTag(c){
    if(c == ">"){
        currentToken.isSelfClosing = true;
        return data;
    }else if(c == "EOF"){

    }else{

    }
}

module.exports.parseHTML = function parseHTML(html){
    let state = data;
    for(let c of html){
        state = state(c);
    }
    state = state(EOF);
}