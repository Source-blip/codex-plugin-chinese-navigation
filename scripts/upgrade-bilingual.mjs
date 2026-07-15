import { readFile, writeFile } from "node:fs/promises";

const file = new URL("../index.html", import.meta.url);
let html = await readFile(file, "utf8");

if (html.includes("const I18N=")) {
  console.log("Bilingual catalog UI is already installed.");
  process.exit(0);
}

function replaceRequired(search, replacement, label) {
  if (!html.includes(search)) {
    throw new Error(`Could not find ${label}. The catalog template may have changed.`);
  }
  html = html.replace(search, replacement);
}

replaceRequired(
  "<title>Codex 插件与 ChatGPT 应用中文导航｜中文搜索与分类</title>",
  "<title>Codex 插件与 ChatGPT 应用导航 | Chinese & English Plugin Directory</title>",
  "page title",
);
replaceRequired(
  "<meta name=\"description\" content=\"面向刚接触 Codex、不熟悉英文，以及需要办公、开发、设计、学习和销售工具的用户。支持用中文和日常说法搜索 Codex 插件、ChatGPT 应用与连接器，并提供分类筛选、中文介绍、官方图标与离线使用。\">",
  "<meta name=\"description\" content=\"面向 Codex 新手和中英文用户的插件与 ChatGPT 应用导航。支持中文、English、缩写和日常说法搜索，并提供分类、状态、官方图标和详细介绍。\">",
  "page description",
);

replaceRequired(
  "</style>",
  `.top-actions{margin-left:auto;display:flex;align-items:center;gap:12px}.top .sub{margin-left:0}.lang-toggle{height:34px;padding:0 12px;border:1px solid #d8dbe4;border-radius:999px;background:#fff;color:#373c49;font-size:12px;font-weight:800;cursor:pointer}.lang-toggle:hover{border-color:#bdb7ff;background:var(--soft);color:#4338ca}.top h1{min-width:0}.lang-toggle:focus-visible,.quick-btn:focus-visible,.side-btn:focus-visible,.card:focus-visible,.clear:focus-visible,.filter-toggle:focus-visible{outline:3px solid rgba(85,72,231,.25);outline-offset:2px}@media(max-width:560px){.top h1{font-size:15px}.top-actions{gap:6px}.lang-toggle{padding:0 9px}}
</style>`,
  "style closing tag",
);

replaceRequired(
  "<h1>Codex 插件与应用中文导航</h1><span class=\"sub\">目录版本：2026年7月15日</span>",
  "<h1 id=\"siteTitle\">Codex 插件与应用中文导航</h1><div class=\"top-actions\"><span id=\"catalogVersion\" class=\"sub\">目录版本：2026年7月15日</span><button id=\"languageToggle\" class=\"lang-toggle\" type=\"button\" aria-label=\"Switch to English\">English</button></div>",
  "site header",
);
replaceRequired(
  "<aside class=\"sidebar\"><div class=\"side-title\">快速分类</div>",
  "<aside class=\"sidebar\"><div id=\"sideTitle\" class=\"side-title\">快速分类</div>",
  "sidebar title",
);
replaceRequired(
  "<button id=\"filterToggle\" class=\"filter-toggle\" type=\"button\" aria-expanded=\"false\" aria-controls=\"filters\">筛选 <span",
  "<button id=\"filterToggle\" class=\"filter-toggle\" type=\"button\" aria-expanded=\"false\" aria-controls=\"filters\"><span id=\"filterToggleLabel\">筛选</span> <span",
  "mobile filter button",
);

const statsStart = html.indexOf("const STATS=");
const pageStart = html.indexOf("const PAGE=", statsStart);
const scriptEnd = html.indexOf("</script>", pageStart);
if (statsStart < 0 || pageStart < 0 || scriptEnd < 0) {
  throw new Error("Could not locate the catalog UI script boundaries.");
}
const statsSource = html.slice(statsStart, pageStart);

const uiScript = String.raw`const PAGE=48;
const I18N={
zh:{siteTitle:"Codex 插件与应用中文导航",pageTitle:"Codex 插件与 ChatGPT 应用导航 | 中文与英文搜索",version:"目录版本：2026年7月15日",languageButton:"English",languageAria:"Switch to English",sideTitle:"快速分类",searchPlaceholder:"例如：做表格、PPT、控制电脑、查邮件、英伟达、Notion...",searchAria:"搜索目录",filter:"筛选",quickAria:"常用筛选",all:"全部",session:"当前会话可用",configured:"配置已启用",cached:"已下载未启用",updated:"最近更新",allTypes:"全部类型",allCategories:"全部分类",allStatuses:"全部状态",smart:"推荐排序",updatedFirst:"本次更新优先",byName:"按中文名",allUpdates:"全部更新状态",onlyUpdated:"只看本次更新",allIcons:"全部图标",withIcon:"有官方图标",withoutIcon:"官方图标未公开",clear:"清空",allItems:"全部项目",detailAria:"项目详情",closeAria:"关闭详情",back:"返回目录",noDisplay:"没有可显示的项目",noResults:"没有找到匹配项目，请换个关键词。",officialMissingLarge:"官方目录<br>未公开图标",officialMissing:"无公开<br>官方图标",available:"当前会话可用",new:"本次更新",duplicate:"目录里存在同名项目，已按不同应用 ID 分别保留。",draft:"这是测试草稿，不代表可正常使用的正式应用。",currentSession:"当前会话",sessionYes:"当前会话可用，可以直接调用。",sessionNo:"当前会话未提供；安装或已缓存不等于本次会话可用。",installStatus:"安装与配置状态",typeCategory:"类型与分类",searchTerms:"常用搜索词",crossLanguage:"英文原始介绍（用于核对翻译）",versionSource:"版本 / 来源",notMarked:"未标注",openOfficial:"打开官方介绍或安装页面",loadMore:"继续显示更多（剩余 {n} 项）",summary:"找到 {count} 项（已显示 {shown} 项） · 当前会话可用 {session} 个插件 · 配置已启用 {configured} 项 · 仅缓存 {cached} 项 · 可安装 {installable} 项 · 本次更新 {updated} 个插件",cardAria:"查看 {name} 详情"},
en:{siteTitle:"Codex Plugins & Apps Directory",pageTitle:"Codex Plugins & ChatGPT Apps Directory | Chinese & English Search",version:"Catalog: July 15, 2026",languageButton:"中文",languageAria:"切换到中文",sideTitle:"Browse categories",searchPlaceholder:"Try: spreadsheets, PPT, computer control, email, NVIDIA, Notion...",searchAria:"Search the catalog",filter:"Filters",quickAria:"Quick filters",all:"All",session:"Available now",configured:"Enabled",cached:"Downloaded",updated:"Recently updated",allTypes:"All types",allCategories:"All categories",allStatuses:"All statuses",smart:"Recommended",updatedFirst:"Recently updated first",byName:"By English name",allUpdates:"All update states",onlyUpdated:"Updated only",allIcons:"All icons",withIcon:"Official icon available",withoutIcon:"Official icon unavailable",clear:"Clear",allItems:"All items",detailAria:"Item details",closeAria:"Close details",back:"Back to directory",noDisplay:"No item is available to display.",noResults:"No matching item was found. Try another keyword.",officialMissingLarge:"Official catalog<br>icon unavailable",officialMissing:"No public<br>official icon",available:"Available this session",new:"Recently updated",duplicate:"The catalog contains items with the same name. They are kept separately by app ID.",draft:"This is a catalog draft and does not represent a production-ready app.",currentSession:"Current session",sessionYes:"Available in this session and ready to call.",sessionNo:"Not exposed in this session. Installed or cached does not automatically mean currently callable.",installStatus:"Installation and configuration",typeCategory:"Type and category",searchTerms:"Useful search terms",crossLanguage:"Chinese plain-language guide",versionSource:"Version / source",notMarked:"Not specified",openOfficial:"Open official details or installation page",loadMore:"Show more ({n} remaining)",summary:"Found {count} items ({shown} shown) · {session} available this session · {configured} enabled · {cached} downloaded · {installable} installable · {updated} recently updated",cardAria:"View details for {name}"}
};
const LABELS={
kind:{"可安装插件":"Installable plugin","已安装插件":"Installed plugin","应用/连接器":"App / connector"},
category:{"AI开发":"AI development","代码协作":"Code collaboration","其他":"Other","办公文档":"Office documents","商业与企业":"Business & enterprise","娱乐":"Entertainment","开发工具":"Developer tools","效率办公":"Productivity","教育学习":"Education","数据分析":"Data & analytics","新闻资讯":"News & information","旅行出行":"Travel","日历与会议":"Calendar & meetings","沟通协作":"Communication","浏览器与电脑控制":"Browser & computer control","生活方式":"Lifestyle","硬件与仿真":"Hardware & simulation","设计与视频":"Design & video","设计创作":"Design & creative","购物":"Shopping","邮件与云盘":"Email & cloud storage","金融理财":"Finance","销售":"Sales","销售与CRM":"Sales & CRM","项目管理":"Project management","餐饮美食":"Food & dining"},
status:{"仅缓存":"Downloaded, not enabled","可安装":"Installable","已连接":"Connected","未连接":"Not connected","目录草稿":"Catalog draft","配置已启用":"Enabled in configuration"},
icon:{"官方图标未公开，已使用分类占位图标":"Official icon unavailable; category placeholder shown","按应用 ID 获取的官方图标":"Official icon matched by app ID","插件官方图标":"Official plugin icon"}
};
const STATUS_HELP={
zh:{"配置已启用":"检测快照中已写入启用配置；是否能在本次会话直接调用，请看“当前会话可用”标记。","仅缓存":"检测快照中已有插件文件，但没有写入启用配置；若有“当前会话可用”标记，本次会话仍可调用。","可安装":"当前目录里可以找到，但检测快照中没有下载；需要安装后才能使用。","已连接":"应用已经连接，可以按权限读取或处理内容。","未连接":"应用在目录里，但还需要登录或授权。","目录草稿":"这是目录测试记录，不代表正式可用。"},
en:{"配置已启用":"The detected configuration enables this plugin. Check the available-this-session badge to see whether it can be called now.","仅缓存":"Plugin files were detected, but the plugin is not enabled in configuration. A current-session badge still takes precedence.","可安装":"This plugin appears in the catalog but was not detected as downloaded. Install it before use.","已连接":"The app is connected and can work within the permissions you granted.","未连接":"The app is listed but still requires sign-in or authorization.","目录草稿":"This is a test catalog record, not a confirmed production app."}
};
const initialHash=(()=>{try{return decodeURIComponent(location.hash.slice(1))}catch{return ""}})();
let limit=PAGE,sessionOnly=false,language=(()=>{try{const saved=localStorage.getItem("catalog-language");if(saved==="zh"||saved==="en")return saved}catch{}return navigator.language.toLowerCase().startsWith("zh")?"zh":"en"})(),selectedId=ITEMS.some(x=>x.id===initialHash)?initialHash:(ITEMS.find(x=>x.sessionAvailable)?.id||ITEMS.find(x=>x.status==="配置已启用")?.id||ITEMS[0]?.id||"");
const el={search:document.querySelector("#search"),type:document.querySelector("#type"),category:document.querySelector("#category"),status:document.querySelector("#status"),sort:document.querySelector("#sort"),updateFilter:document.querySelector("#updateFilter"),iconFilter:document.querySelector("#iconFilter"),clear:document.querySelector("#clear"),filterToggle:document.querySelector("#filterToggle"),filterToggleLabel:document.querySelector("#filterToggleLabel"),filterCount:document.querySelector("#filterCount"),filters:document.querySelector("#filters"),quick:document.querySelector("#quickFilters"),grid:document.querySelector("#grid"),detail:document.querySelector("#detail"),backdrop:document.querySelector("#detailBackdrop"),summary:document.querySelector("#summary"),nav:document.querySelector("#categoryNav"),title:document.querySelector("#siteTitle"),version:document.querySelector("#catalogVersion"),sideTitle:document.querySelector("#sideTitle"),language:document.querySelector("#languageToggle")};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s??"").toLowerCase().replace(/[\s\-_/\\.,，。！？'“”‘’()（）:：]+/g,"");
const t=(key,vars={})=>Object.entries(vars).reduce((text,[name,value])=>text.replaceAll("{"+name+"}",String(value)),I18N[language][key]||key);
const translated=(group,value)=>language==="en"?(LABELS[group]?.[value]||value):value;
const itemName=x=>language==="en"?(x.en||x.cn):x.cn;
const itemSecondary=x=>language==="en"?x.cn:x.en;
const itemDescription=x=>language==="en"?(x.originalDescription||x.plain):x.plain;
const compactView=()=>window.matchMedia("(max-width:1120px)").matches;
function setOptions(select,rows){const value=select.value;select.innerHTML=rows.map(row=>'<option value="'+esc(row.value)+'">'+esc(row.label)+'</option>').join("");if(rows.some(row=>row.value===value))select.value=value}
function populateSelects(){const kinds=[...new Set(ITEMS.map(x=>x.kind))];const categories=[...new Set(ITEMS.map(x=>x.category))].sort((a,b)=>translated("category",a).localeCompare(translated("category",b),language==="en"?"en":"zh-CN"));const statuses=[...new Set(ITEMS.map(x=>x.status))];setOptions(el.type,[{value:"",label:t("allTypes")},...kinds.map(value=>({value,label:translated("kind",value)}))]);setOptions(el.category,[{value:"",label:t("allCategories")},...categories.map(value=>({value,label:translated("category",value)}))]);setOptions(el.status,[{value:"",label:t("allStatuses")},...statuses.map(value=>({value,label:translated("status",value)}))]);setOptions(el.sort,[{value:"smart",label:t("smart")},{value:"updated",label:t("updatedFirst")},{value:"cn",label:t("byName")}]);setOptions(el.updateFilter,[{value:"",label:t("allUpdates")},{value:"updated",label:t("onlyUpdated")}]);setOptions(el.iconFilter,[{value:"",label:t("allIcons")},{value:"yes",label:t("withIcon")},{value:"no",label:t("withoutIcon")}])}
function renderNav(){const counts=Object.entries(ITEMS.reduce((m,x)=>(m[x.category]=(m[x.category]||0)+1,m),{})).sort((a,b)=>b[1]-a[1]);el.nav.innerHTML='<button class="side-btn active" data-cat=""><span>'+t("allItems")+'</span><span>'+ITEMS.length+'</span></button>'+counts.map(([category,count])=>'<button class="side-btn" data-cat="'+esc(category)+'"><span>'+esc(translated("category",category))+'</span><span>'+count+'</span></button>').join("")}
function syncStaticText(){document.documentElement.lang=language==="en"?"en":"zh-CN";document.title=t("pageTitle");el.title.textContent=t("siteTitle");el.version.textContent=t("version");el.sideTitle.textContent=t("sideTitle");el.search.placeholder=t("searchPlaceholder");el.search.setAttribute("aria-label",t("searchAria"));el.filterToggleLabel.textContent=t("filter");el.quick.setAttribute("aria-label",t("quickAria"));el.clear.textContent=t("clear");el.detail.setAttribute("aria-label",t("detailAria"));el.backdrop.setAttribute("aria-label",t("closeAria"));el.language.textContent=t("languageButton");el.language.setAttribute("aria-label",t("languageAria"));const quickLabels={all:"all",session:"session",configured:"configured",cached:"cached",updated:"updated"};el.quick.querySelectorAll("[data-quick]").forEach(button=>button.textContent=t(quickLabels[button.dataset.quick]));populateSelects();renderNav();try{localStorage.setItem("catalog-language",language)}catch{}}
function queryMatches(x){const terms=String(el.search.value||"").trim().toLowerCase().split(/\s+/).map(norm).filter(Boolean);if(!terms.length)return true;const haystack=norm([x.cn,x.en,x.plain,x.originalDescription,x.category,translated("category",x.category),x.keywords].join(" "));return terms.every(term=>haystack.includes(term))}
function activeFilterCount(){return [el.type.value,el.category.value,el.status.value,el.updateFilter.value,el.iconFilter.value,sessionOnly?"session":""].filter(Boolean).length}
function syncControls(){const count=activeFilterCount();el.filterCount.textContent=String(count);el.filterToggle.setAttribute("aria-expanded",String(el.filters.classList.contains("open")));document.querySelectorAll(".side-btn").forEach(button=>button.classList.toggle("active",button.dataset.cat===el.category.value));const mode=el.updateFilter.value==="updated"?"updated":sessionOnly?"session":el.status.value==="配置已启用"?"configured":el.status.value==="仅缓存"?"cached":count===0?"all":"";el.quick.querySelectorAll("[data-quick]").forEach(button=>button.classList.toggle("active",button.dataset.quick===mode))}
function setFiltersOpen(open){el.filters.classList.toggle("open",open);el.filterToggle.setAttribute("aria-expanded",String(open))}
function openDetail(){document.body.classList.add("detail-open");el.detail.focus({preventScroll:true})}
function closeDetail(){document.body.classList.remove("detail-open")}
function filtered(){const rank={"配置已启用":0,"仅缓存":1,"可安装":2,"目录草稿":3};const list=ITEMS.filter(x=>(!el.type.value||x.kind===el.type.value)&&(!el.category.value||x.category===el.category.value)&&(!el.status.value||x.status===el.status.value)&&(!sessionOnly||x.sessionAvailable===true)&&(!el.updateFilter.value||x.isUpdated===true)&&(!el.iconFilter.value||(el.iconFilter.value==="yes"&&x.hasOfficialIcon)||(el.iconFilter.value==="no"&&!x.hasOfficialIcon))&&queryMatches(x));return list.sort((a,b)=>{const locale=language==="en"?"en":"zh-CN";if(el.sort.value==="updated")return Number(Boolean(b.isUpdated))-Number(Boolean(a.isUpdated))||itemName(a).localeCompare(itemName(b),locale);if(el.sort.value==="cn")return itemName(a).localeCompare(itemName(b),locale);return Number(Boolean(b.sessionAvailable))-Number(Boolean(a.sessionAvailable))||(rank[a.status]??9)-(rank[b.status]??9)||Number(Boolean(b.isUpdated))-Number(Boolean(a.isUpdated))||itemName(a).localeCompare(itemName(b),locale)})}
function icon(x,large=false){return x.icon?'<img class="icon" src="'+x.icon+'" alt="'+esc(x.en)+' '+esc(translated("icon",x.iconStatus))+'">':'<div class="no-icon">'+(large?t("officialMissingLarge"):t("officialMissing"))+'</div>'}
function showDetail(x){if(!x){el.detail.innerHTML='<button id="detailClose" class="detail-close" type="button">'+t("back")+'</button><div class="empty">'+t("noDisplay")+'</div>';return}const sessionBadge=x.sessionAvailable?'<span class="badge ok">'+t("available")+'</span>':'';const updatedBadge=x.isUpdated?'<span class="badge new">'+t("new")+'</span>':'';const excluded=["中文介绍","大白话","Codex 新手","不熟悉英文",x.cn,x.en,x.category];const searchTerms=Array.from(new Set((x.keywords||[]).map(String))).filter(term=>term.length<=(language==="en"?28:18)&&!excluded.includes(term)).slice(0,10);const source=[x.version,x.pluginSource].filter(Boolean).join(" · ");const crossLanguage=language==="en"?x.plain:x.originalDescription;el.detail.innerHTML='<button id="detailClose" class="detail-close" type="button">'+t("back")+'</button>'+icon(x,true)+'<h2>'+esc(itemName(x))+'</h2><div class="detail-en">'+esc(itemSecondary(x))+'</div><div class="badges" style="margin-top:12px">'+sessionBadge+updatedBadge+'<span class="badge '+(x.hasOfficialIcon?'ok':'warn')+'">'+esc(translated("icon",x.iconStatus))+'</span><span class="badge">'+esc(translated("status",x.status))+'</span></div><p class="detail-desc">'+esc(itemDescription(x))+'</p>'+(x.duplicate?'<div class="notice">'+t("duplicate")+'</div>':'')+(x.status==="目录草稿"?'<div class="notice">'+t("draft")+'</div>':'')+'<div class="block"><strong>'+t("currentSession")+'</strong>'+(x.sessionAvailable?t("sessionYes"):t("sessionNo"))+'</div><div class="block"><strong>'+t("installStatus")+'</strong>'+esc(translated("status",x.status))+' · '+esc(STATUS_HELP[language][x.status]||"")+'</div><div class="block"><strong>'+t("typeCategory")+'</strong>'+esc(translated("kind",x.kind))+' · '+esc(translated("category",x.category))+'</div>'+(searchTerms.length?'<div class="block"><strong>'+t("searchTerms")+'</strong>'+searchTerms.map(esc).join(language==="en"?', ':'、')+'</div>':'')+'<div class="block"><strong>'+t("crossLanguage")+'</strong><span class="original">'+esc(crossLanguage)+'</span></div><div class="block"><strong>'+t("versionSource")+'</strong>'+esc(source||t("notMarked"))+'</div>'+(x.installUrl?'<div class="block"><a class="link" href="'+esc(x.installUrl)+'" target="_blank" rel="noopener">'+t("openOfficial")+'</a></div>':'')}
function attrValue(value){return String(value).replace(/\\/g,"\\\\").replace(/"/g,'\\"')}
function jumpToSelected(){try{history.replaceState(null,"","#"+encodeURIComponent(selectedId))}catch{}if(compactView()){openDetail();return}const card=el.grid.querySelector('[data-id="'+attrValue(selectedId)+'"]');if(!card)return;card.scrollIntoView({behavior:"smooth",block:"center"});card.focus({preventScroll:true})}
function render(){const list=filtered();if(!list.some(x=>x.id===selectedId))selectedId=list[0]?.id||"";const selectedIndex=list.findIndex(x=>x.id===selectedId);if(selectedIndex>=limit)limit=Math.ceil((selectedIndex+1)/PAGE)*PAGE;el.summary.textContent=t("summary",{count:list.length,shown:Math.min(limit,list.length),session:STATS.sessionAvailable,configured:STATS.configured,cached:STATS.cached,installable:STATS.installable,updated:STATS.updatedPlugins});const visible=list.slice(0,limit);el.grid.innerHTML=visible.length?visible.map(x=>{const sessionBadge=x.sessionAvailable?'<span class="badge ok">'+t("available")+'</span>':'';const updatedBadge=x.isUpdated?'<span class="badge new">'+t("new")+'</span>':'';return '<article class="card '+(x.id===selectedId?'selected':'')+'" data-id="'+esc(x.id)+'" tabindex="0" role="button" aria-label="'+esc(t("cardAria",{name:itemName(x)}))+'">'+icon(x)+'<h3>'+esc(itemName(x))+'</h3><div class="en">'+esc(itemSecondary(x))+'</div><p class="desc">'+esc(itemDescription(x))+'</p><div class="badges">'+sessionBadge+updatedBadge+'<span class="badge '+(x.hasOfficialIcon?'ok':'warn')+'">'+esc(translated("icon",x.iconStatus))+'</span><span class="badge">'+esc(translated("status",x.status))+'</span></div></article>'}).join("")+(list.length>limit?'<button id="load" class="load">'+t("loadMore",{n:list.length-limit})+'</button>':''):'<div class="empty">'+t("noResults")+'</div>';showDetail(list.find(x=>x.id===selectedId)||list[0]);syncControls()}
function resetLimit(){limit=PAGE;render()}
function applyFilter(){limit=PAGE;if(window.matchMedia("(max-width:760px)").matches)setFiltersOpen(false);render()}
function toggleLanguage(){language=language==="zh"?"en":"zh";syncStaticText();render()}
el.search.addEventListener("input",resetLimit);el.type.addEventListener("change",applyFilter);el.category.addEventListener("change",applyFilter);el.status.addEventListener("change",applyFilter);el.sort.addEventListener("change",applyFilter);el.updateFilter.addEventListener("change",applyFilter);el.iconFilter.addEventListener("change",applyFilter);el.language.addEventListener("click",toggleLanguage);
el.filterToggle.addEventListener("click",()=>setFiltersOpen(!el.filters.classList.contains("open")));
el.quick.addEventListener("click",event=>{const button=event.target.closest("[data-quick]");if(!button)return;const mode=button.dataset.quick;if(mode==="all"){el.type.value="";el.category.value="";el.status.value="";el.updateFilter.value="";el.iconFilter.value="";el.sort.value="smart";sessionOnly=false}else{sessionOnly=mode==="session";el.status.value=mode==="configured"?"配置已启用":mode==="cached"?"仅缓存":"";el.updateFilter.value=mode==="updated"?"updated":""}limit=PAGE;render()});
el.clear.addEventListener("click",()=>{el.search.value="";el.type.value="";el.category.value="";el.status.value="";el.sort.value="smart";el.updateFilter.value="";el.iconFilter.value="";sessionOnly=false;selectedId=ITEMS.find(x=>x.sessionAvailable)?.id||ITEMS.find(x=>x.status==="配置已启用")?.id||ITEMS[0]?.id||"";try{history.replaceState(null,"",location.pathname+location.search)}catch{}limit=PAGE;setFiltersOpen(false);closeDetail();render()});
el.nav.addEventListener("click",event=>{const button=event.target.closest("[data-cat]");if(!button)return;el.category.value=button.dataset.cat;resetLimit()});
el.grid.addEventListener("click",event=>{if(event.target.closest("#load")){limit+=PAGE;render();return}const card=event.target.closest("[data-id]");if(card){selectedId=card.dataset.id;render();jumpToSelected()}});
el.grid.addEventListener("keydown",event=>{if((event.key==="Enter"||event.key===" ")&&event.target.matches("[data-id]")){event.preventDefault();selectedId=event.target.dataset.id;render();jumpToSelected()}});
el.detail.addEventListener("click",event=>{if(event.target.closest("#detailClose"))closeDetail()});
el.backdrop.addEventListener("click",closeDetail);document.addEventListener("keydown",event=>{if(event.key==="Escape")closeDetail()});window.addEventListener("resize",()=>{if(!compactView())closeDetail()});
syncStaticText();render();if(initialHash&&compactView())openDetail();
`;

html = html.slice(0, statsStart) + statsSource + uiScript + html.slice(scriptEnd);
await writeFile(file, html, "utf8");
console.log("Installed the bilingual catalog UI.");
