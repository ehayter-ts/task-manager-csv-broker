!function(){metadata={systemName:"TaskManagerCSVReader",displayName:"Task Manager CSV Reader Broker",description:"A broker that reads a CSV file and returns the info for use in the Task Manager Application.",configuration:{FirstRowIsHeader:{displayName:"First Row Is Header",type:"boolean",value:!0},LineSplitChar:{displayName:"Line Split Character",type:"string",value:"newline"},FieldSplitChar:{displayName:"Field Split Character",type:"string",value:";"}}},ondescribe=async function({configuration:e}){postSchema({objects:{tasks:{displayName:"Tasks",description:"Describes all tasks in a CSV file",properties:{fileContent:{displayName:"File Content",type:"string"},reference:{displayName:"Internal Reference",type:"string"},category:{displayName:"Category",type:"string"},priority:{displayName:"Priority",type:"string"},assignedTo:{displayName:"Assigned To",type:"string"},subject:{displayName:"Subject",type:"string"},description:{displayName:"Description",type:"string"},dueDate:{displayName:"Task Due Date",type:"dateTime"}},methods:{getTasks:{displayName:"Get Tasks",type:"list",inputs:["fileContent"],outputs:["reference","category","priority","assignedTo","subject","description","dueDate"]}}}}})},onexecute=async function({objectName:t,methodName:r,parameters:a,properties:i,configuration:n,schema:o}){switch(t){case"tasks":await async function(t,r,a){switch(t){case"getTasks":await function(t,r){return new Promise((a,i)=>{try{const i=e.decode((d=t.fileContent.toString(),d.split("<content>")[1].split("</content>")[0]));var n=[];n="newline"==r.LineSplitChar.toString()?i.split(/\r?\n/):i.split(r.LineSplitChar.toString());var o=[];for(let e=r.FirstRowIsHeader?1:0;e<n.length;e++){var s=n[e].split(r.FieldSplitChar.toString());o.push({reference:s[0],category:s[1],priority:s[2],assignedTo:s[3],subject:s[4],description:s[5],dueDate:s[6]})}postResult(o.map(e=>({reference:e.reference,category:e.category,priority:e.priority,assignedTo:e.assignedTo,subject:e.subject,description:e.description,dueDate:e.dueDate}))),a()}catch(e){i(e)}var d})}(r,a);break;default:throw new Error("The method "+t+" is not supported.")}}(r,i,n);break;default:throw new Error("The object "+t+" is not supported.")}};var e={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(t){var r,a,i,n,o,s,d,c="",p=0;for(t=e._utf8_encode(t);p<t.length;)n=(r=t.charCodeAt(p++))>>2,o=(3&r)<<4|(a=t.charCodeAt(p++))>>4,s=(15&a)<<2|(i=t.charCodeAt(p++))>>6,d=63&i,isNaN(a)?s=d=64:isNaN(i)&&(d=64),c=c+this._keyStr.charAt(n)+this._keyStr.charAt(o)+this._keyStr.charAt(s)+this._keyStr.charAt(d);return c},decode:function(t){var r,a,i,n,o,s,d="",c=0;for(t=t.replace(/[^A-Za-z0-9\+\/\=]/g,"");c<t.length;)r=this._keyStr.indexOf(t.charAt(c++))<<2|(n=this._keyStr.indexOf(t.charAt(c++)))>>4,a=(15&n)<<4|(o=this._keyStr.indexOf(t.charAt(c++)))>>2,i=(3&o)<<6|(s=this._keyStr.indexOf(t.charAt(c++))),d+=String.fromCharCode(r),64!=o&&(d+=String.fromCharCode(a)),64!=s&&(d+=String.fromCharCode(i));return d=e._utf8_decode(d)},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");for(var t="",r=0;r<e.length;r++){var a=e.charCodeAt(r);a<128?t+=String.fromCharCode(a):a>127&&a<2048?(t+=String.fromCharCode(a>>6|192),t+=String.fromCharCode(63&a|128)):(t+=String.fromCharCode(a>>12|224),t+=String.fromCharCode(a>>6&63|128),t+=String.fromCharCode(63&a|128))}return t},_utf8_decode:function(e){for(var t="",r=0,a=0,i=0,n=0;r<e.length;)(a=e.charCodeAt(r))<128?(t+=String.fromCharCode(a),r++):a>191&&a<224?(i=e.charCodeAt(r+1),t+=String.fromCharCode((31&a)<<6|63&i),r+=2):(i=e.charCodeAt(r+1),n=e.charCodeAt(r+2),t+=String.fromCharCode((15&a)<<12|(63&i)<<6|63&n),r+=3);return t}}}();
//# sourceMappingURL=index.js.map
