(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))l(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&l(a)}).observe(document,{childList:!0,subtree:!0});function i(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function l(t){if(t.ep)return;t.ep=!0;const n=i(t);fetch(t.href,n)}})();const x=`/*! 98.css v0.1.21 - https://github.com/jdan/98.css */@font-face{font-family:"Pixelated MS Sans Serif";font-style:normal;font-weight:400;src:url(/98-components/assets/ms_sans_serif-C3pax6mQ.woff) format("woff");src:url(/98-components/assets/ms_sans_serif-Du8rjN1q.woff2) format("woff2")}@font-face{font-family:"Pixelated MS Sans Serif";font-style:normal;font-weight:700;src:url(/98-components/assets/ms_sans_serif_bold-B8yxhAcs.woff) format("woff");src:url(/98-components/assets/ms_sans_serif_bold-D5dpRRHG.woff2) format("woff2")}body{color:#222;font-family:Arial;font-size:12px}.title-bar,.window,button,input,label,legend,li[role=tab],option,select,table,textarea,ul.tree-view{-webkit-font-smoothing:none;font-family:"Pixelated MS Sans Serif",Arial;font-size:11px}h1{font-size:5rem}h2{font-size:2.5rem}h3{font-size:2rem}h4{font-size:1.5rem}u{border-bottom:.5px solid #222;text-decoration:none}button,input[type=reset],input[type=submit]{background:silver;border:none;border-radius:0;box-shadow:inset -1px -1px #0a0a0a,inset 1px 1px #fff,inset -2px -2px gray,inset 2px 2px #dfdfdf;box-sizing:border-box;color:transparent;min-height:23px;min-width:75px;padding:0 12px;text-shadow:0 0 #222}button.default,input[type=reset].default,input[type=submit].default{box-shadow:inset -2px -2px #0a0a0a,inset 1px 1px #0a0a0a,inset 2px 2px #fff,inset -3px -3px gray,inset 3px 3px #dfdfdf}.vertical-bar{background:silver;box-shadow:inset -1px -1px #0a0a0a,inset 1px 1px #fff,inset -2px -2px gray,inset 2px 2px #dfdfdf;height:20px;width:4px}button:not(:disabled):active,input[type=reset]:not(:disabled):active,input[type=submit]:not(:disabled):active{box-shadow:inset -1px -1px #fff,inset 1px 1px #0a0a0a,inset -2px -2px #dfdfdf,inset 2px 2px gray;text-shadow:1px 1px #222}button.default:not(:disabled):active,input[type=reset].default:not(:disabled):active,input[type=submit].default:not(:disabled):active{box-shadow:inset 2px 2px #0a0a0a,inset -1px -1px #0a0a0a,inset -2px -2px #fff,inset 3px 3px gray,inset -3px -3px #dfdfdf}@media (not(hover)){button:not(:disabled):hover,input[type=reset]:not(:disabled):hover,input[type=submit]:not(:disabled):hover{box-shadow:inset -1px -1px #fff,inset 1px 1px #0a0a0a,inset -2px -2px #dfdfdf,inset 2px 2px gray}}button:focus,input[type=reset]:focus,input[type=submit]:focus{outline:1px dotted #000;outline-offset:-4px}button::-moz-focus-inner,input[type=reset]::-moz-focus-inner,input[type=submit]::-moz-focus-inner{border:0}:disabled,:disabled+label,input[readonly],input[readonly]+label{color:gray}:disabled+label,button:disabled,input[type=reset]:disabled,input[type=submit]:disabled{text-shadow:1px 1px 0 #fff}.window{background:silver;box-shadow:inset -1px -1px #0a0a0a,inset 1px 1px #dfdfdf,inset -2px -2px gray,inset 2px 2px #fff;padding:3px}.title-bar{align-items:center;background:linear-gradient(90deg,navy,#1084d0);display:flex;justify-content:space-between;padding:3px 2px 3px 3px}.title-bar.inactive{background:linear-gradient(90deg,gray,#b5b5b5)}.title-bar-text{color:#fff;font-weight:700;letter-spacing:0;margin-right:24px}.title-bar-controls{display:flex}.title-bar-controls button{display:block;min-height:14px;min-width:16px;padding:0}.title-bar-controls button:active{padding:0}.title-bar-controls button:focus{outline:none}.title-bar-controls button[aria-label=Minimize],.title-bar-controls button[aria-label].minimize{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg width='6' height='2' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23000' d='M0 0h6v2H0z'/%3E%3C/svg%3E");background-position:bottom 3px left 4px;background-repeat:no-repeat}.title-bar-controls button[aria-label=Maximize],.title-bar-controls button[aria-label].maximize{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg width='9' height='9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9 0H0v9h9V0zM8 2H1v6h7V2z' fill='%23000'/%3E%3C/svg%3E");background-position:top 2px left 3px;background-repeat:no-repeat}.title-bar-controls button[aria-label=Maximize]:disabled,.title-bar-controls button[aria-label].maximize:disabled{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10 1H1v9h9V1zM9 3H2v6h7V3z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9 0H0v9h9V0zM8 2H1v6h7V2z' fill='gray'/%3E%3C/svg%3E");background-position:top 2px left 3px;background-repeat:no-repeat}.title-bar-controls button[aria-label=Restore],.title-bar-controls button[aria-label].restore{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg width='8' height='9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23000' d='M2 0h6v2H2zM7 2h1v4H7zM2 2h1v1H2zM6 5h1v1H6zM0 3h6v2H0zM5 5h1v4H5zM0 5h1v4H0zM1 8h4v1H1z'/%3E%3C/svg%3E");background-position:top 2px left 3px;background-repeat:no-repeat}.title-bar-controls button[aria-label=Help],.title-bar-controls button[aria-label].help{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg width='6' height='9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23000' d='M0 1h2v2H0zM1 0h4v1H1zM4 1h2v2H4zM3 3h2v1H3zM2 4h2v2H2zM2 7h2v2H2z'/%3E%3C/svg%3E");background-position:top 2px left 5px;background-repeat:no-repeat}.title-bar-controls button[aria-label=Close],.title-bar-controls button[aria-label].close{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg width='8' height='7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0h2v1h1v1h2V1h1V0h2v1H7v1H6v1H5v1h1v1h1v1h1v1H6V6H5V5H3v1H2v1H0V6h1V5h1V4h1V3H2V2H1V1H0V0z' fill='%23000'/%3E%3C/svg%3E");background-position:top 3px left 4px;background-repeat:no-repeat;margin-left:2px}.status-bar{gap:1px;display:flex;margin:0 1px}.status-bar-field{box-shadow:inset -1px -1px #dfdfdf,inset 1px 1px gray;flex-grow:1;margin:0;padding:2px 3px}.window-body{margin:8px}fieldset{border-image:url("data:image/svg+xml;charset=utf-8,%3Csvg width='5' height='5' fill='gray' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0h5v5H0V2h2v1h1V2H0' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0h4v4H0V1h1v2h2V1H0'/%3E%3C/svg%3E") 2;margin:0;padding:10px;padding-block-start:8px}legend{background:silver}.field-row{align-items:center;display:flex}[class^=field-row]+[class^=field-row]{margin-top:6px}.field-row>*+*{margin-left:6px}.field-row-stacked{display:flex;flex-direction:column}.field-row-stacked *+*{margin-top:6px}label{align-items:center;display:inline-flex;-webkit-user-select:none;user-select:none}input[type=checkbox],input[type=radio]{appearance:none;-webkit-appearance:none;-moz-appearance:none;background:0;border:none;margin:0;opacity:0;position:fixed}input[type=checkbox]+label,input[type=radio]+label{line-height:13px}input[type=radio]+label{margin-left:18px;position:relative}input[type=radio]+label:before{background:url("data:image/svg+xml;charset=utf-8,%3Csvg width='12' height='12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 0H4v1H2v1H1v2H0v4h1v2h1V8H1V4h1V2h2V1h4v1h2V1H8V0z' fill='gray'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 1H4v1H2v2H1v4h1v1h1V8H2V4h1V3h1V2h4v1h2V2H8V1z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9 3h1v1H9V3zm1 5V4h1v4h-1zm-2 2V9h1V8h1v2H8zm-4 0v1h4v-1H4zm0 0V9H2v1h2z' fill='%23DFDFDF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11 2h-1v2h1v4h-1v2H8v1H4v-1H2v1h2v1h4v-1h2v-1h1V8h1V4h-1V2z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M4 2h4v1h1v1h1v4H9v1H8v1H4V9H3V8H2V4h1V3h1V2z' fill='%23fff'/%3E%3C/svg%3E");content:"";display:inline-block;height:12px;left:-18px;margin-right:6px;position:absolute;top:0;width:12px}input[type=radio]:active+label:before{background:url("data:image/svg+xml;charset=utf-8,%3Csvg width='12' height='12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 0H4v1H2v1H1v2H0v4h1v2h1V8H1V4h1V2h2V1h4v1h2V1H8V0z' fill='gray'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 1H4v1H2v2H1v4h1v1h1V8H2V4h1V3h1V2h4v1h2V2H8V1z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9 3h1v1H9V3zm1 5V4h1v4h-1zm-2 2V9h1V8h1v2H8zm-4 0v1h4v-1H4zm0 0V9H2v1h2z' fill='%23DFDFDF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11 2h-1v2h1v4h-1v2H8v1H4v-1H2v1h2v1h4v-1h2v-1h1V8h1V4h-1V2z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M4 2h4v1h1v1h1v4H9v1H8v1H4V9H3V8H2V4h1V3h1V2z' fill='silver'/%3E%3C/svg%3E")}input[type=radio]:checked+label:after{background:url("data:image/svg+xml;charset=utf-8,%3Csvg width='4' height='4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M3 0H1v1H0v2h1v1h2V3h1V1H3V0z' fill='%23000'/%3E%3C/svg%3E");content:"";display:block;height:4px;left:-14px;position:absolute;top:4px;width:4px}input[type=checkbox]:focus+label,input[type=radio]:focus+label{outline:1px dotted #000}input[type=radio][disabled]+label:before{background:url("data:image/svg+xml;charset=utf-8,%3Csvg width='12' height='12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 0H4v1H2v1H1v2H0v4h1v2h1V8H1V4h1V2h2V1h4v1h2V1H8V0z' fill='gray'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 1H4v1H2v2H1v4h1v1h1V8H2V4h1V3h1V2h4v1h2V2H8V1z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9 3h1v1H9V3zm1 5V4h1v4h-1zm-2 2V9h1V8h1v2H8zm-4 0v1h4v-1H4zm0 0V9H2v1h2z' fill='%23DFDFDF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11 2h-1v2h1v4h-1v2H8v1H4v-1H2v1h2v1h4v-1h2v-1h1V8h1V4h-1V2z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M4 2h4v1h1v1h1v4H9v1H8v1H4V9H3V8H2V4h1V3h1V2z' fill='silver'/%3E%3C/svg%3E")}input[type=radio][disabled]:checked+label:after{background:url("data:image/svg+xml;charset=utf-8,%3Csvg width='4' height='4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M3 0H1v1H0v2h1v1h2V3h1V1H3V0z' fill='gray'/%3E%3C/svg%3E")}input[type=checkbox]+label{margin-left:19px;position:relative}input[type=checkbox]+label:before{background:#fff;box-shadow:inset -1px -1px #fff,inset 1px 1px gray,inset -2px -2px #dfdfdf,inset 2px 2px #0a0a0a;content:"";display:inline-block;height:13px;left:-19px;margin-right:6px;position:absolute;width:13px}input[type=checkbox]:active+label:before{background:silver}input[type=checkbox]:checked+label:after{background:url("data:image/svg+xml;charset=utf-8,%3Csvg width='7' height='7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7 0H6v1H5v1H4v1H3v1H2V3H1V2H0v3h1v1h1v1h1V6h1V5h1V4h1V3h1V0z' fill='%23000'/%3E%3C/svg%3E");content:"";display:block;height:7px;left:-16px;position:absolute;width:7px}input[type=checkbox][disabled]+label:before{background:silver}input[type=checkbox][disabled]:checked+label:after{background:url("data:image/svg+xml;charset=utf-8,%3Csvg width='7' height='7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7 0H6v1H5v1H4v1H3v1H2V3H1V2H0v3h1v1h1v1h1V6h1V5h1V4h1V3h1V0z' fill='gray'/%3E%3C/svg%3E")}input[type=email],input[type=number],input[type=password],input[type=search],input[type=tel],input[type=text],input[type=url]{-webkit-appearance:none;-moz-appearance:none;appearance:none;border:none;border-radius:0}input[type=email],input[type=number],input[type=password],input[type=search],input[type=tel],input[type=text],input[type=url],select{background-color:#fff;box-shadow:inset -1px -1px #fff,inset 1px 1px gray,inset -2px -2px #dfdfdf,inset 2px 2px #0a0a0a;box-sizing:border-box;padding:3px 4px}select,textarea{border:none}textarea{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:#fff;border-radius:0;box-shadow:inset -1px -1px #fff,inset 1px 1px gray,inset -2px -2px #dfdfdf,inset 2px 2px #0a0a0a;box-sizing:border-box;padding:3px 4px}input[type=email],input[type=password],input[type=search],input[type=tel],input[type=text],input[type=url],select{height:21px}input[type=number]{height:22px}input[type=search]::-ms-clear,input[type=search]::-ms-reveal{display:none;height:0;width:0}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration{display:none}input[type=email],input[type=number],input[type=password],input[type=search],input[type=tel],input[type=text],input[type=url]{line-height:2}input[type=email]:disabled,input[type=email]:read-only,input[type=number]:disabled,input[type=number]:read-only,input[type=password]:disabled,input[type=password]:read-only,input[type=search]:disabled,input[type=search]:read-only,input[type=tel]:disabled,input[type=tel]:read-only,input[type=text]:disabled,input[type=text]:read-only,input[type=url]:disabled,input[type=url]:read-only,textarea:disabled{background-color:silver}select{appearance:none;-webkit-appearance:none;-moz-appearance:none;background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 0H0v16h1V1h14V0z' fill='%23DFDFDF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2 1H1v14h1V2h12V1H2z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16 17H0v-1h15V0h1v17z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 1h-1v14H1v1h14V1z' fill='gray'/%3E%3Cpath fill='silver' d='M2 2h12v13H2z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11 6H4v1h1v1h1v1h1v1h1V9h1V8h1V7h1V6z' fill='%23000'/%3E%3C/svg%3E");background-position:top 2px right 2px;background-repeat:no-repeat;border-radius:0;padding-right:32px;position:relative}input[type=email]:focus,input[type=number]:focus,input[type=password]:focus,input[type=search]:focus,input[type=tel]:focus,input[type=text]:focus,input[type=url]:focus,select:focus,textarea:focus{outline:none}input[type=range]{-webkit-appearance:none;background:transparent;width:100%}input[type=range]:focus{outline:none}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;background:url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0v16h2v2h2v2h1v-1H3v-2H1V1h9V0z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M1 1v15h1v1h1v1h1v1h2v-1h1v-1h1v-1h1V1z' fill='%23C0C7C8'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9 1h1v15H8v2H6v2H5v-1h2v-2h2z' fill='%2387888F'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10 0h1v16H9v2H7v2H5v1h1v-2h2v-2h2z' fill='%23000'/%3E%3C/svg%3E");border:none;box-shadow:none;height:21px;transform:translateY(-8px);width:11px}input[type=range].has-box-indicator::-webkit-slider-thumb{background:url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0v20h1V1h9V0z' fill='%23fff'/%3E%3Cpath fill='%23C0C7C8' d='M1 1h8v18H1z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9 1h1v19H1v-1h8z' fill='%2387888F'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10 0h1v21H0v-1h10z' fill='%23000'/%3E%3C/svg%3E");transform:translateY(-10px)}input[type=range]::-moz-range-thumb{background:url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0v16h2v2h2v2h1v-1H3v-2H1V1h9V0z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M1 1v15h1v1h1v1h1v1h2v-1h1v-1h1v-1h1V1z' fill='%23C0C7C8'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9 1h1v15H8v2H6v2H5v-1h2v-2h2z' fill='%2387888F'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10 0h1v16H9v2H7v2H5v1h1v-2h2v-2h2z' fill='%23000'/%3E%3C/svg%3E");border:0;border-radius:0;height:21px;transform:translateY(2px);width:11px}input[type=range].has-box-indicator::-moz-range-thumb{background:url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0v20h1V1h9V0z' fill='%23fff'/%3E%3Cpath fill='%23C0C7C8' d='M1 1h8v18H1z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9 1h1v19H1v-1h8z' fill='%2387888F'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10 0h1v21H0v-1h10z' fill='%23000'/%3E%3C/svg%3E");transform:translateY(0)}input[type=range]::-webkit-slider-runnable-track{background:#000;border-bottom:1px solid grey;border-right:1px solid grey;box-shadow:1px 0 #fff,1px 1px #fff,0 1px #fff,-1px 0 #a9a9a9,-1px -1px #a9a9a9,0 -1px #a9a9a9,-1px 1px #fff,1px -1px #a9a9a9;box-sizing:border-box;height:2px;width:100%}input[type=range]::-moz-range-track{background:#000;border-bottom:1px solid grey;border-right:1px solid grey;box-shadow:1px 0 #fff,1px 1px #fff,0 1px #fff,-1px 0 #a9a9a9,-1px -1px #a9a9a9,0 -1px #a9a9a9,-1px 1px #fff,1px -1px #a9a9a9;box-sizing:border-box;height:2px;width:100%}.is-vertical{display:inline-block;height:150px;transform:translateY(50%);width:4px}.is-vertical>input[type=range]{height:4px;margin:0 16px 0 10px;transform:rotate(270deg) translate(calc(-50% + 8px));transform-origin:left;width:150px}.is-vertical>input[type=range]::-webkit-slider-runnable-track{border-bottom:1px solid grey;border-left:1px solid grey;border-right:0;box-shadow:-1px 0 #fff,-1px 1px #fff,0 1px #fff,1px 0 #a9a9a9,1px -1px #a9a9a9,0 -1px #a9a9a9,1px 1px #fff,-1px -1px #a9a9a9}.is-vertical>input[type=range]::-moz-range-track{border-bottom:1px solid grey;border-left:1px solid grey;border-right:0;box-shadow:-1px 0 #fff,-1px 1px #fff,0 1px #fff,1px 0 #a9a9a9,1px -1px #a9a9a9,0 -1px #a9a9a9,1px 1px #fff,-1px -1px #a9a9a9}.is-vertical>input[type=range]::-webkit-slider-thumb{transform:translateY(-8px) scaleX(-1)}.is-vertical>input[type=range].has-box-indicator::-webkit-slider-thumb{transform:translateY(-10px) scaleX(-1)}.is-vertical>input[type=range]::-moz-range-thumb{transform:translateY(2px) scaleX(-1)}.is-vertical>input[type=range].has-box-indicator::-moz-range-thumb{transform:translateY(0) scaleX(-1)}select:focus{background-color:navy;color:#fff}select:focus option{background-color:#fff;color:#000}select:active{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0h16v17H0V0zm1 16h14V1H1v15z' fill='gray'/%3E%3Cpath fill='silver' d='M1 1h14v15H1z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12 7H5v1h1v1h1v1h1v1h1v-1h1V9h1V8h1V7z' fill='%23000'/%3E%3C/svg%3E")}a{color:#00f}a:focus{outline:1px dotted #00f}ul.tree-view{background:#fff;box-shadow:inset -1px -1px #fff,inset 1px 1px gray,inset -2px -2px #dfdfdf,inset 2px 2px #0a0a0a;display:block;margin:0;padding:6px}ul.tree-view li{list-style-type:none}ul.tree-view a{color:#000;text-decoration:none}ul.tree-view a:focus{background-color:navy;color:#fff}ul.tree-view li,ul.tree-view ul{margin-top:3px}ul.tree-view ul{border-left:1px dotted grey;margin-left:16px;padding-left:16px}ul.tree-view ul>li{position:relative}ul.tree-view ul>li:before{border-bottom:1px dotted grey;content:"";display:block;left:-16px;position:absolute;top:6px;width:12px}ul.tree-view ul>li:last-child:after{background:#fff;bottom:0;content:"";display:block;left:-20px;position:absolute;top:7px;width:8px}ul.tree-view details{margin-top:0}ul.tree-view details[open] summary{margin-bottom:0}ul.tree-view ul details>summary:before{margin-left:-22px;position:relative;z-index:1}ul.tree-view details>summary:before{background-color:#fff;border:1px solid grey;content:"+";display:block;float:left;height:9px;line-height:8px;margin-right:5px;padding-left:1px;text-align:center;width:8px}ul.tree-view details[open]>summary:before{content:"-"}ul.tree-view details>summary::-webkit-details-marker,ul.tree-view details>summary::marker{content:""}pre{background:#fff;box-shadow:inset -1px -1px #fff,inset 1px 1px gray,inset -2px -2px #dfdfdf,inset 2px 2px #0a0a0a;display:block;margin:0;padding:12px 8px}code,code *{font-family:monospace}summary:focus{outline:1px dotted #000}::-webkit-scrollbar{width:16px}::-webkit-scrollbar:horizontal{height:17px}::-webkit-scrollbar-corner{background:#dfdfdf}::-webkit-scrollbar-track{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg width='2' height='2' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M1 0H0v1h1v1h1V1H1V0z' fill='silver'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2 0H1v1H0v1h1V1h1V0z' fill='%23fff'/%3E%3C/svg%3E")}::-webkit-scrollbar-thumb{background-color:#dfdfdf;box-shadow:inset -1px -1px #0a0a0a,inset 1px 1px #fff,inset -2px -2px gray,inset 2px 2px #dfdfdf}::-webkit-scrollbar-button:horizontal:end:increment,::-webkit-scrollbar-button:horizontal:start:decrement,::-webkit-scrollbar-button:vertical:end:increment,::-webkit-scrollbar-button:vertical:start:decrement{display:block}::-webkit-scrollbar-button:vertical:start{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 0H0v16h1V1h14V0z' fill='%23DFDFDF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2 1H1v14h1V2h12V1H2z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16 17H0v-1h15V0h1v17z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 1h-1v14H1v1h14V1z' fill='gray'/%3E%3Cpath fill='silver' d='M2 2h12v13H2z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 6H7v1H6v1H5v1H4v1h7V9h-1V8H9V7H8V6z' fill='%23000'/%3E%3C/svg%3E");height:17px}::-webkit-scrollbar-button:vertical:end{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 0H0v16h1V1h14V0z' fill='%23DFDFDF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2 1H1v14h1V2h12V1H2z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16 17H0v-1h15V0h1v17z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 1h-1v14H1v1h14V1z' fill='gray'/%3E%3Cpath fill='silver' d='M2 2h12v13H2z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11 6H4v1h1v1h1v1h1v1h1V9h1V8h1V7h1V6z' fill='%23000'/%3E%3C/svg%3E");height:17px}::-webkit-scrollbar-button:horizontal:start{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 0H0v16h1V1h14V0z' fill='%23DFDFDF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2 1H1v14h1V2h12V1H2z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16 17H0v-1h15V0h1v17z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 1h-1v14H1v1h14V1z' fill='gray'/%3E%3Cpath fill='silver' d='M2 2h12v13H2z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9 4H8v1H7v1H6v1H5v1h1v1h1v1h1v1h1V4z' fill='%23000'/%3E%3C/svg%3E");width:16px}::-webkit-scrollbar-button:horizontal:end{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 0H0v16h1V1h14V0z' fill='%23DFDFDF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2 1H1v14h1V2h12V1H2z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16 17H0v-1h15V0h1v17z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 1h-1v14H1v1h14V1z' fill='gray'/%3E%3Cpath fill='silver' d='M2 2h12v13H2z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7 4H6v7h1v-1h1V9h1V8h1V7H9V6H8V5H7V4z' fill='%23000'/%3E%3C/svg%3E");width:16px}.window[role=tabpanel]{position:relative;z-index:2}menu[role=tablist]{display:flex;list-style-type:none;margin:0 0 -2px;padding-left:3px;position:relative;text-indent:0}menu[role=tablist]>li{border-top-left-radius:3px;border-top-right-radius:3px;box-shadow:inset -1px 0 #0a0a0a,inset 1px 1px #dfdfdf,inset -2px 0 gray,inset 2px 2px #fff;z-index:1}menu[role=tablist]>li[aria-selected=true]{background-color:silver;margin-left:-3px;margin-top:-2px;padding-bottom:2px;position:relative;z-index:8}menu[role=tablist]>li>a{color:#222;display:block;margin:6px;text-decoration:none}menu[role=tablist]>li[aria-selected=true]>a:focus{outline:none}menu[role=tablist]>li>a:focus{outline:1px dotted #222}menu[role=tablist].multirows>li{flex-grow:1;text-align:center}.sunken-panel{border:2px groove transparent;border-image:url("data:image/svg+xml;charset=utf-8,%3Csvg width='5' height='5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='gray' d='M0 0h4v1H0z'/%3E%3Cpath fill='gray' d='M0 0h1v4H0z'/%3E%3Cpath fill='%230a0a0a' d='M1 1h2v1H1z'/%3E%3Cpath fill='%230a0a0a' d='M1 1h1v2H1z'/%3E%3Cpath fill='%23fff' d='M0 4h5v1H0z'/%3E%3Cpath fill='%23fff' d='M4 0h1v5H4z'/%3E%3Cpath fill='%23dfdfdf' d='M3 1h1v3H3z'/%3E%3Cpath fill='%23dfdfdf' d='M1 3h3v1H1z'/%3E%3C/svg%3E") 2;box-sizing:border-box;overflow:auto}.sunken-panel,table{background-color:#fff}table{border-collapse:collapse;position:relative;text-align:left;white-space:nowrap}table>thead>tr>*{background:silver;box-shadow:inset -1px -1px #0a0a0a,inset 1px 1px #fff,inset -2px -2px gray,inset 2px 2px #dfdfdf;box-sizing:border-box;font-weight:400;height:17px;padding:0 6px;position:sticky;top:0}table.interactive>tbody>tr{cursor:pointer}table>tbody>tr.highlighted{background-color:navy;color:#fff}table>tbody>tr>*{height:14px;padding:0 6px}.progress-indicator{-webkit-appearance:none;-moz-appearance:none;appearance:none;border:none;border-radius:0;box-shadow:inset -2px -2px #dfdfdf,inset 2px 2px gray;box-sizing:border-box;height:32px;padding:4px;position:relative}.progress-indicator>.progress-indicator-bar{background-color:navy;display:block;height:100%}.progress-indicator.segmented>.progress-indicator-bar{background-color:transparent;background-image:linear-gradient(90deg,navy 16px,transparent 0 2px);background-repeat:repeat;background-size:18px 100%;width:100%}.field-border{background:#fff}.field-border,.field-border-disabled{box-shadow:inset -1px -1px #fff,inset 1px 1px gray,inset -2px -2px #dfdfdf,inset 2px 2px #0a0a0a;padding:2px}.field-border-disabled{background:silver}.status-field-border{background:silver;box-shadow:inset -1px -1px #dfdfdf,inset 1px 1px gray;padding:1px}`;class A extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render()}static get observedAttributes(){return["title","resizable","inactive","show-help","status-bar","show-minimize","show-maximize"]}attributeChangedCallback(e,i,l){this.shadowRoot&&this.render()}render(){const e=this.getAttribute("title")||"Window",i=this.hasAttribute("inactive"),l=this.hasAttribute("show-help"),t=this.hasAttribute("status-bar"),n=this.hasAttribute("show-minimize")!==!1&&!l,a=this.hasAttribute("show-maximize")!==!1,s=new CSSStyleSheet;s.replaceSync(x),this.shadowRoot.adoptedStyleSheets=[s],this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          position: absolute;
        }
        .window {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .window-body {
          flex: 1;
          overflow: auto;
        }
        .resize-handle {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 20px;
          height: 20px;
          cursor: nwse-resize;
          z-index: 10;
        }
      </style>
      <div class="window">
        <div class="title-bar${i?" inactive":""}">
          <div class="title-bar-text">${e}</div>
          <div class="title-bar-controls">
            ${l?'<button aria-label="Help"></button>':""}
            ${n?'<button aria-label="Minimize"></button>':""}
            ${a?'<button aria-label="Maximize"></button>':""}
            <button aria-label="Close"></button>
          </div>
        </div>
        <div class="window-body">
          <slot></slot>
        </div>
        ${t?'<div class="status-bar"><slot name="status"></slot></div>':""}
        ${this.hasAttribute("resizable")?'<div class="resize-handle"></div>':""}
      </div>
    `,this.setupInteractions()}setupInteractions(){const e=this.shadowRoot.querySelector(".title-bar"),i=this.shadowRoot.querySelector('[aria-label="Minimize"]'),l=this.shadowRoot.querySelector('[aria-label="Maximize"]'),t=this.shadowRoot.querySelector('[aria-label="Close"]'),n=this.shadowRoot.querySelector('[aria-label="Help"]');if(e.addEventListener("mousedown",a=>{if(a.target.tagName==="BUTTON")return;a.preventDefault();const s=this.getBoundingClientRect(),u=a.clientX-s.left,c=a.clientY-s.top,d=document.createElement("div");d.style.position="fixed",d.style.width=`${s.width-4}px`,d.style.height=`${s.height-4}px`,d.style.left=`${s.left}px`,d.style.top=`${s.top}px`,d.style.border="2px solid white",d.style.mixBlendMode="difference",d.style.zIndex="99999",d.style.pointerEvents="none",document.body.appendChild(d);const f=h=>{d.style.left=`${h.clientX-u}px`,d.style.top=`${h.clientY-c}px`},v=h=>{document.removeEventListener("mousemove",f),document.removeEventListener("mouseup",v),this.style.left=`${h.clientX-u}px`,this.style.top=`${h.clientY-c}px`,document.body.removeChild(d)};document.addEventListener("mousemove",f),document.addEventListener("mouseup",v)}),i&&i.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("window-minimize",{bubbles:!0,composed:!0}));const a=this.shadowRoot.querySelector(".window-body");a.style.display=a.style.display==="none"?"block":"none"}),l&&l.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("window-maximize",{bubbles:!0,composed:!0})),this.style.width==="100%"&&this.style.height==="100%"?(this.style.width=this.dataset.prevWidth||"",this.style.height=this.dataset.prevHeight||"",this.style.top=this.dataset.prevTop||"",this.style.left=this.dataset.prevLeft||""):(this.dataset.prevWidth=this.style.width,this.dataset.prevHeight=this.style.height,this.dataset.prevTop=this.style.top,this.dataset.prevLeft=this.style.left,this.style.width="100%",this.style.height="100%",this.style.top="0",this.style.left="0")}),t&&t.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("window-close",{bubbles:!0,composed:!0})),this.remove()}),n&&n.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("window-help",{bubbles:!0,composed:!0}))}),this.hasAttribute("resizable")){const a=this.shadowRoot.querySelector(".resize-handle");a&&a.addEventListener("mousedown",s=>{s.preventDefault(),s.stopPropagation();const u=s.clientX,c=s.clientY,d=parseInt(getComputedStyle(this).width,10),f=parseInt(getComputedStyle(this).height,10),v=100,h=100,b=m=>{const D=Math.max(v,d+(m.clientX-u)),L=Math.max(h,f+(m.clientY-c));this.style.width=`${D}px`,this.style.height=`${L}px`},g=()=>{document.removeEventListener("mousemove",b),document.removeEventListener("mouseup",g)};document.addEventListener("mousemove",b),document.addEventListener("mouseup",g)})}}}customElements.define("win98-window",A);class O extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render()}static get observedAttributes(){return["default","disabled"]}attributeChangedCallback(e,i,l){this.shadowRoot&&this.render()}render(){const e=this.hasAttribute("default"),i=this.hasAttribute("disabled"),l=new CSSStyleSheet;l.replaceSync(x),this.shadowRoot.adoptedStyleSheets=[l],this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: inline-block;
        }
        button {
          cursor: pointer;
        }
        button:disabled {
          cursor: default;
        }
      </style>
      <button class="${e?"default":""}" ${i?"disabled":""}>
        <slot></slot>
      </button>
    `,this.setupInteractions()}setupInteractions(){this.shadowRoot.querySelector("button").addEventListener("click",i=>{this.hasAttribute("disabled")||this.dispatchEvent(new CustomEvent("button-click",{bubbles:!0,composed:!0}))})}}customElements.define("win98-button",O);class I extends HTMLElement{static get formAssociated(){return!0}constructor(){super(),this.attachShadow({mode:"open"}),this.internals_=this.attachInternals(),this.isOpen=!1,this.selectedIndex=-1,this.options=[],this.handleDocumentClick=this.handleDocumentClick.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this)}connectedCallback(){this.render(),this.updateOptions(),this.shadowRoot.querySelector("slot").addEventListener("slotchange",()=>{this.updateOptions(),this.render()}),document.addEventListener("click",this.handleDocumentClick),this.addEventListener("keydown",this.handleKeyDown),this.hasAttribute("tabindex")||this.setAttribute("tabindex","0"),this.setAttribute("role","combobox"),this.setAttribute("aria-haspopup","listbox"),this.setAttribute("aria-expanded","false")}disconnectedCallback(){document.removeEventListener("click",this.handleDocumentClick),this.removeEventListener("keydown",this.handleKeyDown)}get form(){return this.internals_.form}get name(){return this.getAttribute("name")}get type(){return this.localName}get validity(){return this.internals_.validity}get validationMessage(){return this.internals_.validationMessage}get willValidate(){return this.internals_.willValidate}checkValidity(){return this.internals_.checkValidity()}reportValidity(){return this.internals_.reportValidity()}get value(){var e;return((e=this.options[this.selectedIndex])==null?void 0:e.value)||""}set value(e){const i=this.options.findIndex(l=>l.value===e);i!==-1&&this.select(i,!1)}formResetCallback(){this.options.length>0&&this.select(0,!1)}formStateRestoreCallback(e,i){this.value=e}handleDocumentClick(e){this.contains(e.target)||this.close()}handleKeyDown(e){if(!this.hasAttribute("disabled"))switch(e.key){case" ":case"Enter":e.preventDefault(),this.isOpen?this.select(this.selectedIndex):this.toggle();break;case"Escape":this.isOpen&&(e.preventDefault(),this.close());break;case"ArrowDown":e.preventDefault(),this.isOpen?this.moveSelection(1):this.toggle();break;case"ArrowUp":e.preventDefault(),this.isOpen?this.moveSelection(-1):this.toggle();break;case"Home":e.preventDefault(),this.isOpen&&this.select(0,!1);break;case"End":e.preventDefault(),this.isOpen&&this.select(this.options.length-1,!1);break}}moveSelection(e){const i=Math.max(0,Math.min(this.options.length-1,this.selectedIndex+e));this.select(i,!1),this.scrollToOption(i)}scrollToOption(e){const l=this.shadowRoot.querySelector(".dropdown-list").children[e];l&&l.scrollIntoView({block:"nearest"})}updateOptions(){const i=this.shadowRoot.querySelector("slot").assignedNodes().filter(l=>l.tagName==="OPTION");this.options=i.map((l,t)=>({text:l.textContent,value:l.getAttribute("value")||l.textContent,index:t})),this.options.length>0&&this.selectedIndex===-1&&this.select(0,!1)}toggle(){this.hasAttribute("disabled")||(this.isOpen=!this.isOpen,this.setAttribute("aria-expanded",this.isOpen),this.render(),this.isOpen&&this.selectedIndex!==-1&&setTimeout(()=>this.scrollToOption(this.selectedIndex),0))}close(){this.isOpen&&(this.isOpen=!1,this.setAttribute("aria-expanded","false"),this.render())}select(e,i=!0){e<0||e>=this.options.length||(this.selectedIndex=e,this.internals_.setFormValue(this.value),i?(this.close(),this.dispatchEvent(new CustomEvent("change",{bubbles:!0,composed:!0,detail:{value:this.options[e].value,index:e}}))):this.render())}render(){const e=new CSSStyleSheet;e.replaceSync(x),this.shadowRoot.adoptedStyleSheets=[e];const i=this.options[this.selectedIndex],l=i?i.text:"";this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: inline-block;
          font-family: "Pixelated MS Sans Serif", Arial, sans-serif;
          font-size: 11px;
          position: relative;
          width: 150px;
          outline: none;
        }
        
        /* Remove old focus style */
        :host(:focus) .select-box {
            outline: none;
        }

        /* Focus style for the text area */
        :host(:focus) .selected-value {
            background-color: #000080;
            color: #fff;
            outline: 1px dotted #ff0;
            outline-offset: -1px;
        }
        
        .select-box {
          background-color: #fff;
          border-bottom: 1px solid #fff;
          border-left: 1px solid #808080;
          border-right: 1px solid #fff;
          border-top: 1px solid #808080;
          box-shadow: inset -1px -1px #dfdfdf, inset 1px 1px #0a0a0a;
          box-sizing: border-box;
          color: #000;
          height: 21px;
          padding: 2px 16px 2px 2px; /* Reduced padding */
          position: relative;
          cursor: default;
          user-select: none;
          display: flex;
          align-items: center;
        }
        
        .selected-value {
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            padding: 0 2px;
            margin-right: 2px; /* Space for arrow */
        }

        .select-arrow {
            position: absolute;
            right: 0px;
            top: 1px;
            width: 16px;
            height: 16px;
            background-color: #c0c0c0;
            border-left: 1px solid #fff;
            border-top: 1px solid #fff;
            border-right: 1px solid #000;
            border-bottom: 1px solid #000;
            box-shadow: inset 1px 1px #dfdfdf, inset -1px -1px #808080;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .select-box:active .select-arrow {
             border-left: 1px solid #000;
            border-top: 1px solid #020202ff;
            border-right: 1px solid #fff;
            border-bottom: 1px solid #fff;
            box-shadow: inset 1px 1px #808080, inset -1px -1px #dfdfdf;
        }

        .select-arrow svg {
            width: 8px;
            height: 4px;
        }

        .dropdown-list {
          display: ${this.isOpen?"block":"none"};
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          max-height: 200px;
          overflow-y: auto;
          background-color: #fff;
          border: 1px solid #000;
          z-index: 1000;
          margin-top: 1px;
        }

        .dropdown-item {
          padding: 2px 4px;
          cursor: default;
          color: #000;
          border: 1px solid transparent;
        }

        .dropdown-item:hover,
        .dropdown-item.selected {
          background-color: #000080;
          color: #fff;
        }

        .dropdown-item.selected {
          border: 1px dotted #ff0;
        }
      </style>
      
      <div class="select-box" role="button" aria-haspopup="listbox" aria-expanded="${this.isOpen}">
        <span class="selected-value">${l}</span>
        <div class="select-arrow">
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H8L4 4L0 0Z" fill="black"/>
            </svg>
        </div>
      </div>
      
      <div class="dropdown-list" role="listbox">
        ${this.options.map((t,n)=>`
          <div class="dropdown-item ${n===this.selectedIndex?"selected":""}" 
               role="option" 
               aria-selected="${n===this.selectedIndex}"
               data-index="${n}">
            ${t.text}
          </div>
        `).join("")}
      </div>
      <slot style="display: none;"></slot>
    `,this.shadowRoot.querySelector(".select-box").addEventListener("click",()=>this.toggle()),this.shadowRoot.querySelectorAll(".dropdown-item").forEach(t=>{t.addEventListener("mouseenter",()=>{this.shadowRoot.querySelectorAll(".dropdown-item").forEach(n=>n.classList.remove("selected")),t.classList.add("selected")}),t.addEventListener("click",n=>{n.stopPropagation(),this.select(parseInt(t.dataset.index))})})}}customElements.define("win98-select",I);const r=document.getElementById("desktop-stage");function p(){r.innerHTML=""}var w;(w=document.getElementById("nav-window-basic"))==null||w.addEventListener("click",o=>{o.preventDefault(),p();const e=document.createElement("win98-window");e.setAttribute("title","Basic Window"),e.style.top="50px",e.style.left="300px",e.style.width="300px",e.innerHTML=`
    <div style="padding: 16px;">
      <p>A basic window with all default controls.</p>
    </div>
  `,r.appendChild(e)});var y;(y=document.getElementById("nav-window-resizable"))==null||y.addEventListener("click",o=>{o.preventDefault(),p();const e=document.createElement("win98-window");e.setAttribute("title","Resizable Window"),e.setAttribute("resizable",""),e.style.top="50px",e.style.left="300px",e.style.width="300px",e.style.height="200px",e.innerHTML=`
    <div style="padding: 16px;">
      <p>This window can be resized by dragging the bottom-right corner.</p>
    </div>
  `,r.appendChild(e)});var H;(H=document.getElementById("nav-window-status"))==null||H.addEventListener("click",o=>{o.preventDefault(),p();const e=document.createElement("win98-window");e.setAttribute("title","Window with Status Bar"),e.setAttribute("resizable",""),e.setAttribute("status-bar",""),e.style.top="50px",e.style.left="300px",e.style.width="320px",e.style.height="250px",e.innerHTML=`
    <div style="padding: 16px;">
      <p>This window has a status bar at the bottom.</p>
      <p>You can add multiple status fields using slotted content.</p>
    </div>
    <p slot="status" class="status-bar-field">Ready</p>
    <p slot="status" class="status-bar-field">CPU: 14%</p>
  `,r.appendChild(e)});var E;(E=document.getElementById("nav-window-inactive"))==null||E.addEventListener("click",o=>{o.preventDefault(),p();const e=document.createElement("win98-window");e.setAttribute("title","Inactive Window"),e.setAttribute("inactive",""),e.style.top="50px",e.style.left="300px",e.style.width="300px",e.innerHTML=`
    <div style="padding: 16px;">
      <p>This window appears inactive/unfocused.</p>
      <p>Notice the grayed-out title bar.</p>
    </div>
  `,r.appendChild(e)});var k;(k=document.getElementById("nav-window-help"))==null||k.addEventListener("click",o=>{o.preventDefault(),p();const e=document.createElement("win98-window");e.setAttribute("title","Help Window"),e.setAttribute("show-help",""),e.style.top="50px",e.style.left="300px",e.style.width="300px",e.innerHTML=`
    <div style="padding: 16px;">
      <p>This window has a Help button (?) instead of Minimize.</p>
      <p>Common in dialog boxes and help windows.</p>
    </div>
  `,e.addEventListener("window-help",()=>{alert("Help button clicked!")}),r.appendChild(e)});var C;(C=document.getElementById("nav-button-basic"))==null||C.addEventListener("click",o=>{o.preventDefault(),p();const e=document.createElement("win98-window");e.setAttribute("title","Basic Button"),e.style.top="50px",e.style.left="300px",e.style.width="300px",e.innerHTML=`
    <div style="padding: 16px; text-align: center;">
      <win98-button>Click Me</win98-button>
      <p style="margin-top: 16px; font-size: 12px;">A standard button with default styling.</p>
    </div>
  `,e.querySelector("win98-button").addEventListener("button-click",()=>{alert("Button clicked!")}),r.appendChild(e)});var V;(V=document.getElementById("nav-button-default"))==null||V.addEventListener("click",o=>{o.preventDefault(),p();const e=document.createElement("win98-window");e.setAttribute("title","Default Button"),e.style.top="50px",e.style.left="300px",e.style.width="300px",e.innerHTML=`
    <div style="padding: 16px; text-align: center;">
      <win98-button default>OK</win98-button>
      <win98-button style="margin-left: 8px;">Cancel</win98-button>
      <p style="margin-top: 16px; font-size: 12px;">The default button has a darker border, indicating it's the primary action.</p>
    </div>
  `,r.appendChild(e)});var z;(z=document.getElementById("nav-button-disabled"))==null||z.addEventListener("click",o=>{o.preventDefault(),p();const e=document.createElement("win98-window");e.setAttribute("title","Disabled Button"),e.style.top="50px",e.style.left="300px",e.style.width="300px",e.innerHTML=`
    <div style="padding: 16px; text-align: center;">
      <win98-button disabled>I cannot be clicked</win98-button>
      <p style="margin-top: 16px; font-size: 12px;">Disabled buttons have a washed-out appearance.</p>
    </div>
  `,r.appendChild(e)});var M;(M=document.getElementById("nav-select"))==null||M.addEventListener("click",o=>{o.preventDefault(),p();const e=document.createElement("win98-window");e.setAttribute("title","Select Component"),e.style.top="50px",e.style.left="300px",e.style.width="300px",e.innerHTML=`
    <div style="padding: 16px; display: flex; flex-direction: column; gap: 16px;">
      <form id="demo-form">
        <label style="display: block; margin-bottom: 4px;">Choose an option:</label>
        <win98-select name="demo-select" id="select-demo">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
          <option value="4">Option 4</option>
          <option value="5">Option 5</option>
        </win98-select>
        <div style="margin-top: 16px;">
          <win98-button type="submit">Submit Form</win98-button>
        </div>
      </form>
      <p>Custom &lt;win98-select&gt; component with fully styled dropdown.</p>
      <p id="select-output">Selected: Option 1</p>
      <p id="form-output" style="color: blue;"></p>
    </div>
  `;const i=e.querySelector("#demo-form"),l=e.querySelector("win98-select"),t=e.querySelector("#select-output"),n=e.querySelector("#form-output");l.addEventListener("change",a=>{t.textContent=`Selected: Option ${a.detail.value} (Index: ${a.detail.index})`}),i.addEventListener("submit",a=>{a.preventDefault();const u=new FormData(i).get("demo-select");n.textContent=`Form Submitted! Value: ${u}`}),r.appendChild(e)});var S;(S=document.getElementById("nav-button-basic"))==null||S.click();
