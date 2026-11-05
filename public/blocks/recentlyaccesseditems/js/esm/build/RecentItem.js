import{jsx as e,jsxs as a}from"react/jsx-runtime";/**
 * A card for a recently accessed activity or resource.
 *
 * @module     block_recentlyaccesseditems/RecentItem
 * @copyright  2026 Muhammad Arnaldo <muhammad.arnaldo@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function s({item:t,expanded:n}){const l=new DOMParser().parseFromString(t.name,"text/html").body.textContent??"";return e("div",{className:"card mb-1",role:"listitem",style:n?{display:"block"}:void 0,children:e("a",{href:t.viewurl,title:l,children:e("div",{className:"card-body p-2 m-1",children:a("div",{className:"d-flex text-truncate",children:[e("div",{className:"d-flex align-self-center activityiconcontainer",dangerouslySetInnerHTML:{__html:t.icon}}),a("div",{className:"w-100 line-height-3 text-truncate ms-2",children:[e("h4",{className:"mb-0 text-truncate h6",children:e("span",{className:"clickable",dangerouslySetInnerHTML:{__html:t.name}})}),e("small",{className:"text-truncate mb-0",dangerouslySetInnerHTML:{__html:t.coursename}})]})]})})})})}export{s as default};
