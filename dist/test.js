"use strict";var e,s=(e=require("ava"))&&"object"==typeof e&&"default"in e?e.default:e;require("@k2oss/k2-broker-core/test-framework"),require("./index"),s("describe returns the hardcoded instance",async e=>{let s=null;var t;t=function(e){s=e},global["postSchema"]=t,await Promise.resolve(ondescribe({configuration:{}})),e.deepEqual(s,{objects:{lines:{displayName:"Lines",description:"Describes all lines in a CSV file",properties:{file:{displayName:"File",type:"string"},line:{displayName:"Line",type:"string"}},methods:{getLines:{displayName:"Get Lines",type:"read",inputs:["file"],outputs:["line"]}}}}}),e.pass()}),s("execute fails with the wrong parameters",async e=>{let s=await e.throwsAsync(Promise.resolve(onexecute({objectName:"test1",methodName:"unused",parameters:{},properties:{},configuration:{},schema:{}})));e.deepEqual(s.message,"The object test1 is not supported."),s=await e.throwsAsync(Promise.resolve(onexecute({objectName:"lines",methodName:"test2",parameters:{},properties:{},configuration:{},schema:{}}))),e.deepEqual(s.message,"The method test2 is not supported."),e.pass()});
//# sourceMappingURL=test.js.map
