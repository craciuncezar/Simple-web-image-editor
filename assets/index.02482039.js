const p=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function a(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=a(e);fetch(e.href,t)}};p();$(function(){$(".img-area").on("dragover",i=>{i.preventDefault()}).on("drop",i=>{i.preventDefault();var o=i.originalEvent.dataTransfer.files;if(o.length>0){var a=new FileReader;a.onload=r=>{$("#initial-image").load(()=>{$("#default-drag-area").addClass("invisible"),$("#imageProcessed").removeClass("invisible"),f()}).attr("src",r.target.result)},a.readAsDataURL(o[0])}}),$("#linkDownload").click(i=>{if(c(),$("#imageProcessed").hasClass("invisible"))i.preventDefault();else{var o=$("#imageProcessed")[0].toDataURL("image/png").replace("image/png","image/octet-stream");$("#linkDownload").attr("href",o)}}),$("#resolutionModal").on("show.bs.modal",i=>{if($("#imageProcessed").hasClass("invisible"))$("#modifyResolution").addClass("invisible"),$("#uploadPictureError").removeClass("invisible");else{$("#uploadPictureError").addClass("invisible"),$("#modifyResolution").removeClass("invisible");var o=$("#imageProcessed")[0];$("#width-size").val(o.width),$("#height-size").val(o.height);var a=o.width/o.height;$("#width-size").keyup(r=>{$("#checkbox-img-ratio").is(":checked")&&$("#height-size").val($("#width-size")[0].value/a)}),$("#height-size").keyup(()=>{$("#checkbox-img-ratio").is(":checked")&&$("#width-size").val($("#height-size")[0].value*a)}),$("#saveResolution").click(()=>{var r=o.getContext("2d"),e=new Image;e.src=o.toDataURL("image/png"),o.width=$("#width-size").val(),o.height=$("#height-size").val(),e.onload=()=>{r.drawImage(e,0,0,o.width,o.height)},$("#resolutionModal").modal("hide")})}c()}),$("#undoButton").click(()=>{c(),f()}),$("#cropButton").click(()=>{c();var i=$("#imageProcessed")[0],o=i.getContext("2d"),a=$("#imageProcessed").offset(),r=!1,e,t=0,s=0,g=0,l=0,n=500,m=700;$("#imageProcessed").mousedown(d=>{r=!0,g=d.pageX,l=d.pageY,t=g-a.left,s=l-a.top,e=new Image,e.src=i.toDataURL("image/png")}).mousemove(d=>{if(r){var v=Math.min(d.pageX-a.left,t),u=Math.min(d.pageY-a.top,s);if(n=Math.abs(d.pageX-a.left-v),m=Math.abs(d.pageY-a.top-u),h(e),!n||!m)return;o.strokeRect(v-1,u-1,n+2,m+2)}}).mouseup(d=>{r=!1,n=d.pageX-g,m=d.pageY-l;var v=new Image;v.src=i.toDataURL("image/png"),v.onload=()=>{o.clearRect(0,0,i.width,i.height),i.width=n,i.height=m,o.drawImage(v,t,s,n,m,0,0,n,m),$("#imageProcessed").unbind("mousedown"),$("#imageProcessed").unbind("mouseup"),$("#imageProcessed").unbind("mousemove")}})}),$("#penDraw").click(()=>{c();var i=!1,o=$("#imageProcessed")[0],a=o.getContext("2d");$("#imageProcessed").mousedown(r=>{a.beginPath(),a.moveTo(r.offsetX,r.offsetY),i=!0}).mousemove(r=>{i&&(a.lineTo(r.offsetX,r.offsetY),a.stroke())}).mouseup(r=>{i&&(i=!1)})}),$("#lineDraw").click(()=>{c();var i=!1,o=$("#imageProcessed")[0],a=o.getContext("2d"),r=$("#imageProcessed").offset(),e,t=0,s=0;$("#imageProcessed").mousedown(g=>{t=g.pageX-r.left,s=g.pageY-r.top,i=!0,e=new Image,e.src=o.toDataURL("image/png")}).mousemove(g=>{i&&(h(e),a.beginPath(),a.moveTo(t,s),a.lineTo(g.pageX-r.left,g.pageY-r.top),a.stroke(),a.closePath())}).mouseup(g=>{i&&(i=!1)})}),$("#rectangleDraw").click(()=>{c();var i=!1,o=$("#imageProcessed")[0],a=o.getContext("2d"),r=$("#imageProcessed").offset(),e,t=0,s=0,g=0,l=0;$("#imageProcessed").mousedown(n=>{t=n.pageX-r.left,s=n.pageY-r.top,i=!0,e=new Image,e.src=o.toDataURL("image/png")}).mousemove(n=>{if(i){if(t=Math.min(n.pageX-r.left,t),s=Math.min(n.pageY-r.top,s),g=Math.abs(n.pageX-r.left-t),l=Math.abs(n.pageY-r.top-s),h(e),!g||!l)return;a.strokeRect(t,s,g,l)}}).mouseup(n=>{i&&(i=!1)})}),$("#circleDraw").click(()=>{c();var i=!1,o=$("#imageProcessed")[0],a=o.getContext("2d"),r=$("#imageProcessed").offset(),e,t=0,s=0;$("#imageProcessed").mousedown(g=>{t=g.pageX-r.left,s=g.pageY-r.top,i=!0,e=new Image,e.src=o.toDataURL("image/png")}).mousemove(g=>{if(i){h(e);var l=g.pageX-r.left,n=g.pageY-r.top;a.beginPath(),a.moveTo(t,s+(n-s)/2),a.bezierCurveTo(t,s,l,s,l,s+(n-s)/2),a.bezierCurveTo(l,n,t,n,t,s+(n-s)/2),a.closePath(),a.stroke()}}).mouseup(g=>{i&&(i=!1)})}),$("#grayscale").click(i=>{var o=$("#imageProcessed")[0],a=o.getContext("2d");let r=a.getImageData(0,0,a.canvas.width,a.canvas.height),e=r.data;for(let t=0;t<e.length;t+=4)e[t]=e[t+1]=e[t+2]=Math.round((e[t]+e[t+1]+e[t+2])/3);a.putImageData(r,0,0)}),$("#threshold").click(i=>{var o=$("#imageProcessed")[0],a=o.getContext("2d");let r=a.getImageData(0,0,a.canvas.width,a.canvas.height),e=r.data;for(let n=0;n<e.length;n+=4){var t=e[n],s=e[n+1],g=e[n+2],l=.2126*t+.7152*s+.0722*g>=180?255:0;e[n]=e[n+1]=e[n+2]=l}a.putImageData(r,0,0)}),$("#sephia").click(i=>{var o=$("#imageProcessed")[0],a=o.getContext("2d");let r=a.getImageData(0,0,a.canvas.width,a.canvas.height),e=r.data;for(var t=0;t<e.length;t+=4){var s=e[t],g=e[t+1],l=e[t+2];e[t]=s*.393+g*.769+l*.189,e[t+1]=s*.349+g*.686+l*.168,e[t+2]=s*.272+g*.534+l*.131}a.putImageData(r,0,0)}),$("#invert").click(i=>{var o=$("#imageProcessed")[0],a=o.getContext("2d");let r=a.getImageData(0,0,a.canvas.width,a.canvas.height),e=r.data;for(var t=0;t<e.length;t+=4){var s=e[t],g=e[t+1],l=e[t+2];e[t]=255-s,e[t+1]=255-g,e[t+2]=255-l}a.putImageData(r,0,0)})});function f(){var i=$("#imageProcessed")[0],o=i.getContext("2d"),a=document.getElementById("initial-image");i.width=a.width,i.height=a.height,o.drawImage(a,0,0,i.width,i.height)}function h(i){var o=$("#imageProcessed")[0],a=o.getContext("2d");o.width=i.width,o.height=i.height,a.drawImage(i,0,0,o.width,o.height)}function c(){$("#imageProcessed").unbind("mousedown"),$("#imageProcessed").unbind("mouseup"),$("#imageProcessed").unbind("mousemove")}