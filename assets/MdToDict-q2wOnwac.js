import{_ as T,r as v,c,d as f,w as M,b as n,t as k,F as y,f as b,e as p,o as d}from"./index-Dv36WFzv.js";const D={data(){return{md:"",outputDict:[],outputMd:"",pcptLink:"",tableHeader:[]}},methods:{mdToDict(t){let e=t.split(`
`);for(var s=0,o=0;o<4;o++)e[o].includes("](")&&(this.pcptLink=e[o]),e[o].includes("|")||(console.log("includes"+e[o]),s+=1);let l=e[s].split("|");this.tableHeader=l;let u=e.slice(s+2).map(a=>{let m=a.split("|"),r={};return l.forEach((i,_)=>{var h;r[i]=(h=m[_])==null?void 0:h.trim()}),r});this.outputDict=u},dictToMd(t){let e=Object.keys(t[0]),s=e.join("|"),o="----|",l=o.repeat(e.length-1)+o.slice(0,-1);this.outputMd=s+`
`,this.outputMd+=l+`
`,console.log(t.slice(1)),t.forEach(u=>{this.outputMd+=Object.values(u).join("|")+`
`})},mdProcessor(t){if(typeof t>"u")return null;if(console.log(t),t.startsWith("**")&&(t!=null&&t.endsWith("**")))return t=t.replaceAll("**",""),`<p style="font-weight: bold;">${t}</p>`;if(t.indexOf("](")!=-1){var e=t.split("]("),s=e[1].slice(0,-1),o=e[0].slice(1);return`<a href="${s}">${o}</a>`}return"<p>"+t+"</p>"}}},V=n("h3",null,"Convert dict to markdown",-1),w=n("br",null,null,-1),x={class:"mt-10"},C=n("div",{class:"mt-10"},[p(" Category|Selection|Source|Price "),n("br"),p(" :----|:----|:----|----: "),n("br"),p(" **CPU** | [I3-12100F](https://pcpricetracker.in/) | Vedant | 8555 "),n("br"),p(" **Mobo** | [ASRock H610M](https://pcpricetracker.in/) | MDComp | 6650 ")],-1),L=["innerHTML"],H={class:"mt-10"},j=["innerHTML"];function P(t,e,s,o,l,u){const a=v("el-input"),m=v("el-button");return d(),c("div",null,[V,f(a,{modelValue:l.md,"onUpdate:modelValue":e[0]||(e[0]=r=>l.md=r),style:{width:"600px"},rows:15,type:"textarea",placeholder:"Type something"},null,8,["modelValue"]),w,f(m,{type:"primary",onClick:e[1]||(e[1]=r=>u.mdToDict(l.md))},{default:M(()=>[p("Convert")]),_:1}),f(m,{type:"primary",onClick:e[2]||(e[2]=r=>u.dictToMd(l.outputDict))},{default:M(()=>[p("Load")]),_:1}),n("div",x,k(l.outputDict),1),C,f(a,{modelValue:l.outputMd,"onUpdate:modelValue":e[3]||(e[3]=r=>l.outputMd=r),style:{width:"600px"},class:"mt-10",rows:15,type:"textarea",placeholder:"Type something"},null,8,["modelValue"]),n("div",{innerHTML:u.mdProcessor(l.pcptLink),class:"mt-10"},null,8,L),n("table",H,[n("thead",null,[n("tr",null,[(d(!0),c(y,null,b(l.tableHeader,(r,i)=>(d(),c("th",{key:i},k(r),1))),128))])]),(d(!0),c(y,null,b(l.outputDict,(r,i)=>(d(),c("tr",{key:i},[(d(!0),c(y,null,b(Object.values(r),(_,h)=>(d(),c("td",{key:i+"-"+h,innerHTML:u.mdProcessor(_)},null,8,j))),128))]))),128))])])}const O=T(D,[["render",P]]);export{O as default};
