const a={context:void 0,registry:void 0,effects:void 0,done:!1,getContextId(){return q(this.context.count)},getNextContextId(){return q(this.context.count++)}};function q(e){const t=String(e),n=t.length-1;return a.context.id+(n?String.fromCharCode(96+n):"")+t}function k(e){a.context=e}function he(){return{...a.context,id:a.getNextContextId(),count:0}}const ge=(e,t)=>e===t,Pe=Symbol("solid-proxy"),pe=Symbol("solid-track"),P={equals:ge};let te=fe;const $=1,U=2,ne={owned:null,cleanups:null,context:null,owner:null};var h=null;let K=null,ye=null,g=null,y=null,C=null,D=0;function O(e,t){const n=g,s=h,i=e.length===0,l=t===void 0?s:t,o=i?ne:{owned:null,cleanups:null,context:l?l.context:null,owner:l},r=i?e:()=>e(()=>T(()=>v(o)));h=o,g=null;try{return L(r,!0)}finally{g=n,h=s}}function G(e,t){t=t?Object.assign({},P,t):P;const n={value:e,observers:null,observerSlots:null,comparator:t.equals||void 0},s=i=>(typeof i=="function"&&(i=i(n.value)),oe(n,i));return[re.bind(n),s]}function j(e,t,n){const s=X(e,t,!1,$);B(s)}function xe(e,t,n){te=Ee;const s=X(e,t,!1,$),i=Y&&le(Y);i&&(s.suspense=i),s.user=!0,C?C.push(s):B(s)}function F(e,t,n){n=n?Object.assign({},P,n):P;const s=X(e,t,!0,0);return s.observers=null,s.observerSlots=null,s.comparator=n.equals||void 0,B(s),re.bind(s)}function Ue(e){return L(e,!1)}function T(e){if(g===null)return e();const t=g;g=null;try{return e()}finally{g=t}}function je(e){xe(()=>T(e))}function se(e){return h===null||(h.cleanups===null?h.cleanups=[e]:h.cleanups.push(e)),e}function Ye(){return g}function we(){return h}function be(e){C.push.apply(C,e),e.length=0}function ie(e,t){const n=Symbol("context");return{id:n,Provider:Te(n),defaultValue:e}}function le(e){let t;return h&&h.context&&(t=h.context[e.id])!==void 0?t:e.defaultValue}function Ae(e){const t=F(e),n=F(()=>W(t()));return n.toArray=()=>{const s=n();return Array.isArray(s)?s:s!=null?[s]:[]},n}let Y;function Ce(){return Y||(Y=ie())}function re(){if(this.sources&&this.state)if(this.state===$)B(this);else{const e=y;y=null,L(()=>_(this),!1),y=e}if(g){const e=this.observers?this.observers.length:0;g.sources?(g.sources.push(this),g.sourceSlots.push(e)):(g.sources=[this],g.sourceSlots=[e]),this.observers?(this.observers.push(g),this.observerSlots.push(g.sources.length-1)):(this.observers=[g],this.observerSlots=[g.sources.length-1])}return this.value}function oe(e,t,n){let s=e.value;return(!e.comparator||!e.comparator(s,t))&&(e.value=t,e.observers&&e.observers.length&&L(()=>{for(let i=0;i<e.observers.length;i+=1){const l=e.observers[i],o=K&&K.running;o&&K.disposed.has(l),(o?!l.tState:!l.state)&&(l.pure?y.push(l):C.push(l),l.observers&&ue(l)),o||(l.state=$)}if(y.length>1e6)throw y=[],new Error},!1)),t}function B(e){if(!e.fn)return;v(e);const t=D;Se(e,e.value,t)}function Se(e,t,n){let s;const i=h,l=g;g=h=e;try{s=e.fn(t)}catch(o){return e.pure&&(e.state=$,e.owned&&e.owned.forEach(v),e.owned=null),e.updatedAt=n+1,ce(o)}finally{g=l,h=i}(!e.updatedAt||e.updatedAt<=n)&&(e.updatedAt!=null&&"observers"in e?oe(e,s):e.value=s,e.updatedAt=n)}function X(e,t,n,s=$,i){const l={fn:e,state:s,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:h,context:h?h.context:null,pure:n};return h===null||h!==ne&&(h.owned?h.owned.push(l):h.owned=[l]),l}function R(e){if(e.state===0)return;if(e.state===U)return _(e);if(e.suspense&&T(e.suspense.inFallback))return e.suspense.effects.push(e);const t=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<D);)e.state&&t.push(e);for(let n=t.length-1;n>=0;n--)if(e=t[n],e.state===$)B(e);else if(e.state===U){const s=y;y=null,L(()=>_(e,t[0]),!1),y=s}}function L(e,t){if(y)return e();let n=!1;t||(y=[]),C?n=!0:C=[],D++;try{const s=e();return me(n),s}catch(s){n||(C=null),y=null,ce(s)}}function me(e){if(y&&(fe(y),y=null),e)return;const t=C;C=null,t.length&&L(()=>te(t),!1)}function fe(e){for(let t=0;t<e.length;t++)R(e[t])}function Ee(e){let t,n=0;for(t=0;t<e.length;t++){const s=e[t];s.user?e[n++]=s:R(s)}if(a.context){if(a.count){a.effects||(a.effects=[]),a.effects.push(...e.slice(0,n));return}k()}for(a.effects&&(a.done||!a.count)&&(e=[...a.effects,...e],n+=a.effects.length,delete a.effects),t=0;t<n;t++)R(e[t])}function _(e,t){e.state=0;for(let n=0;n<e.sources.length;n+=1){const s=e.sources[n];if(s.sources){const i=s.state;i===$?s!==t&&(!s.updatedAt||s.updatedAt<D)&&R(s):i===U&&_(s,t)}}}function ue(e){for(let t=0;t<e.observers.length;t+=1){const n=e.observers[t];n.state||(n.state=U,n.pure?y.push(n):C.push(n),n.observers&&ue(n))}}function v(e){let t;if(e.sources)for(;e.sources.length;){const n=e.sources.pop(),s=e.sourceSlots.pop(),i=n.observers;if(i&&i.length){const l=i.pop(),o=n.observerSlots.pop();s<i.length&&(l.sourceSlots[o]=s,i[s]=l,n.observerSlots[s]=o)}}if(e.tOwned){for(t=e.tOwned.length-1;t>=0;t--)v(e.tOwned[t]);delete e.tOwned}if(e.owned){for(t=e.owned.length-1;t>=0;t--)v(e.owned[t]);e.owned=null}if(e.cleanups){for(t=e.cleanups.length-1;t>=0;t--)e.cleanups[t]();e.cleanups=null}e.state=0}function Ne(e){return e instanceof Error?e:new Error(typeof e=="string"?e:"Unknown error",{cause:e})}function ce(e,t=h){throw Ne(e)}function W(e){if(typeof e=="function"&&!e.length)return W(e());if(Array.isArray(e)){const t=[];for(let n=0;n<e.length;n++){const s=W(e[n]);Array.isArray(s)?t.push.apply(t,s):t.push(s)}return t}return e}function Te(e,t){return function(s){let i;return j(()=>i=T(()=>(h.context={...h.context,[e]:s.value},Ae(()=>s.children))),void 0),i}}const $e=Symbol("fallback");function J(e){for(let t=0;t<e.length;t++)e[t]()}function ke(e,t,n={}){let s=[],i=[],l=[],o=0,r=t.length>1?[]:null;return se(()=>J(l)),()=>{let u=e()||[],d=u.length,c,f;return u[pe],T(()=>{let p,b,x,N,S,w,A,E,I;if(d===0)o!==0&&(J(l),l=[],s=[],i=[],o=0,r&&(r=[])),n.fallback&&(s=[$e],i[0]=O(de=>(l[0]=de,n.fallback())),o=1);else if(o===0){for(i=new Array(d),f=0;f<d;f++)s[f]=u[f],i[f]=O(m);o=d}else{for(x=new Array(d),N=new Array(d),r&&(S=new Array(d)),w=0,A=Math.min(o,d);w<A&&s[w]===u[w];w++);for(A=o-1,E=d-1;A>=w&&E>=w&&s[A]===u[E];A--,E--)x[E]=i[A],N[E]=l[A],r&&(S[E]=r[A]);for(p=new Map,b=new Array(E+1),f=E;f>=w;f--)I=u[f],c=p.get(I),b[f]=c===void 0?-1:c,p.set(I,f);for(c=w;c<=A;c++)I=s[c],f=p.get(I),f!==void 0&&f!==-1?(x[f]=i[c],N[f]=l[c],r&&(S[f]=r[c]),f=b[f],p.set(I,f)):l[c]();for(f=w;f<d;f++)f in x?(i[f]=x[f],l[f]=N[f],r&&(r[f]=S[f],r[f](f))):i[f]=O(m);i=i.slice(0,o=d),s=u.slice(0)}return i});function m(p){if(l[f]=p,r){const[b,x]=G(f);return r[f]=x,t(u[f],b)}return t(u[f])}}}let ae=!1;function Ie(){ae=!0}function He(e,t){if(ae&&a.context){const n=a.context;k(he());const s=T(()=>e(t||{}));return k(n),s}return T(()=>e(t||{}))}function Re(e){const t="fallback"in e&&{fallback:()=>e.fallback};return F(ke(()=>e.each,e.children,t||void 0))}const Fe=ie();function _e(e){let t=0,n,s,i,l,o;const[r,u]=G(!1),d=Ce(),c={increment:()=>{++t===1&&u(!0)},decrement:()=>{--t===0&&u(!1)},inFallback:r,effects:[],resolved:!1},f=we();if(a.context&&a.load){const b=a.getContextId();let x=a.load(b);if(x&&(typeof x!="object"||x.status!=="success"?i=x:a.gather(b)),i&&i!=="$$f"){const[N,S]=G(void 0,{equals:!1});l=N,i.then(()=>{if(a.done)return S();a.gather(b),k(s),S(),k()},w=>{o=w,S()})}}const m=le(Fe);m&&(n=m.register(c.inFallback));let p;return se(()=>p&&p()),He(d.Provider,{value:c,get children(){return F(()=>{if(o)throw o;if(s=a.context,l)return l(),l=void 0;s&&i==="$$f"&&k();const b=F(()=>e.children);return F(x=>{const N=c.inFallback(),{showContent:S=!0,showFallback:w=!0}=n?n():{};if((!N||i&&i!=="$$f")&&S)return c.resolved=!0,p&&p(),p=s=i=void 0,be(c.effects),b();if(w)return p?x:O(A=>(p=A,s&&(k({id:s.id+"F",count:0}),s=void 0),e.fallback),f)})})}})}function Le(e,t,n){let s=n.length,i=t.length,l=s,o=0,r=0,u=t[i-1].nextSibling,d=null;for(;o<i||r<l;){if(t[o]===n[r]){o++,r++;continue}for(;t[i-1]===n[l-1];)i--,l--;if(i===o){const c=l<s?r?n[r-1].nextSibling:n[l-r]:u;for(;r<l;)e.insertBefore(n[r++],c)}else if(l===r)for(;o<i;)(!d||!d.has(t[o]))&&t[o].remove(),o++;else if(t[o]===n[l-1]&&n[r]===t[i-1]){const c=t[--i].nextSibling;e.insertBefore(n[r++],t[o++].nextSibling),e.insertBefore(n[--l],c),t[i]=n[l]}else{if(!d){d=new Map;let f=r;for(;f<l;)d.set(n[f],f++)}const c=d.get(t[o]);if(c!=null)if(r<c&&c<l){let f=o,m=1,p;for(;++f<i&&f<l&&!((p=d.get(t[f]))==null||p!==c+m);)m++;if(m>c-r){const b=t[o];for(;r<c;)e.insertBefore(n[r++],b)}else e.replaceChild(n[r++],t[o++])}else o++;else t[o++].remove()}}}function Z(e,t,n,s={}){let i;return O(l=>{i=l,t===document?e():ve(t,e(),t.firstChild?null:void 0,n)},s.owner),()=>{i(),t.textContent=""}}function Ve(e,t,n){let s;const i=()=>{const o=document.createElement("template");return o.innerHTML=e,o.content.firstChild},l=()=>(s||(s=i())).cloneNode(!0);return l.cloneNode=l,l}function Oe(e,t,n){M(e)||(n==null?e.removeAttribute(t):e.setAttribute(t,n))}function De(e,t){M(e)||(t==null?e.removeAttribute("class"):e.className=t)}function Ke(e,t,n){if(!t)return n?Oe(e,"style"):t;const s=e.style;if(typeof t=="string")return s.cssText=t;typeof n=="string"&&(s.cssText=n=void 0),n||(n={}),t||(t={});let i,l;for(l in n)t[l]==null&&s.removeProperty(l),delete n[l];for(l in t)i=t[l],i!==n[l]&&(s.setProperty(l,i),n[l]=i);return n}function Ge(e,t,n){return T(()=>e(t,n))}function ve(e,t,n,s){if(n!==void 0&&!s&&(s=[]),typeof t!="function")return V(e,t,s,n);j(i=>V(e,t(),i,n),s)}function Be(e,t,n={}){if(globalThis._$HY.done)return Z(e,t,[...t.childNodes],n);a.completed=globalThis._$HY.completed,a.events=globalThis._$HY.events,a.load=s=>globalThis._$HY.r[s],a.has=s=>s in globalThis._$HY.r,a.gather=s=>ee(t,s),a.registry=new Map,a.context={id:n.renderId||"",count:0};try{return ee(t,n.renderId),Z(e,t,[...t.childNodes],n)}finally{a.context=null}}function We(e){let t,n;return!M()||!(t=a.registry.get(n=Me()))?e():(a.completed&&a.completed.add(t),a.registry.delete(n),t)}function Qe(e){let t=e,n=0,s=[];if(M(e))for(;t;){if(t.nodeType===8){const i=t.nodeValue;if(i==="$")n++;else if(i==="/"){if(n===0)return[t,s];n--}}s.push(t),t=t.nextSibling}return[t,s]}function M(e){return!!a.context&&!a.done&&(!e||e.isConnected)}function V(e,t,n,s,i){const l=M(e);if(l){!n&&(n=[...e.childNodes]);let u=[];for(let d=0;d<n.length;d++){const c=n[d];c.nodeType===8&&c.data.slice(0,2)==="!$"?c.remove():u.push(c)}n=u}for(;typeof n=="function";)n=n();if(t===n)return n;const o=typeof t,r=s!==void 0;if(e=r&&n[0]&&n[0].parentNode||e,o==="string"||o==="number"){if(l||o==="number"&&(t=t.toString(),t===n))return n;if(r){let u=n[0];u&&u.nodeType===3?u.data!==t&&(u.data=t):u=document.createTextNode(t),n=H(e,n,s,u)}else n!==""&&typeof n=="string"?n=e.firstChild.data=t:n=e.textContent=t}else if(t==null||o==="boolean"){if(l)return n;n=H(e,n,s)}else{if(o==="function")return j(()=>{let u=t();for(;typeof u=="function";)u=u();n=V(e,u,n,s)}),()=>n;if(Array.isArray(t)){const u=[],d=n&&Array.isArray(n);if(Q(u,t,n,i))return j(()=>n=V(e,u,n,s,!0)),()=>n;if(l){if(!u.length)return n;if(s===void 0)return n=[...e.childNodes];let c=u[0];if(c.parentNode!==e)return n;const f=[c];for(;(c=c.nextSibling)!==s;)f.push(c);return n=f}if(u.length===0){if(n=H(e,n,s),r)return n}else d?n.length===0?z(e,u,s):Le(e,n,u):(n&&H(e),z(e,u));n=u}else if(t.nodeType){if(l&&t.parentNode)return n=r?[t]:t;if(Array.isArray(n)){if(r)return n=H(e,n,s,t);H(e,n,null,t)}else n==null||n===""||!e.firstChild?e.appendChild(t):e.replaceChild(t,e.firstChild);n=t}}return n}function Q(e,t,n,s){let i=!1;for(let l=0,o=t.length;l<o;l++){let r=t[l],u=n&&n[e.length],d;if(!(r==null||r===!0||r===!1))if((d=typeof r)=="object"&&r.nodeType)e.push(r);else if(Array.isArray(r))i=Q(e,r,u)||i;else if(d==="function")if(s){for(;typeof r=="function";)r=r();i=Q(e,Array.isArray(r)?r:[r],Array.isArray(u)?u:[u])||i}else e.push(r),i=!0;else{const c=String(r);u&&u.nodeType===3&&u.data===c?e.push(u):e.push(document.createTextNode(c))}}return i}function z(e,t,n=null){for(let s=0,i=t.length;s<i;s++)e.insertBefore(t[s],n)}function H(e,t,n,s){if(n===void 0)return e.textContent="";const i=s||document.createTextNode("");if(t.length){let l=!1;for(let o=t.length-1;o>=0;o--){const r=t[o];if(i!==r){const u=r.parentNode===e;!l&&!o?u?e.replaceChild(i,r):e.insertBefore(i,n):u&&r.remove()}else l=!0}}else e.insertBefore(i,n);return[i]}function ee(e,t){const n=e.querySelectorAll("*[data-hk]");for(let s=0;s<n.length;s++){const i=n[s],l=i.getAttribute("data-hk");(!t||l.startsWith(t))&&!a.registry.has(l)&&a.registry.set(l,i)}}function Me(){return a.getNextContextId()}const Xe=(...e)=>(Ie(),Be(...e));export{Pe as $,Re as F,_e as S,De as a,F as b,j as c,G as d,He as e,Qe as f,We as g,Ke as h,ve as i,pe as j,Ye as k,Ue as l,Xe as m,je as o,Z as r,Oe as s,Ve as t,Ge as u};
