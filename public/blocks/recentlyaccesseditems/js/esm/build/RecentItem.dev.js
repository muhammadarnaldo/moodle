var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * A card for a recently accessed activity or resource.
 *
 * @module     block_recentlyaccesseditems/RecentItem
 * @copyright  2026 Muhammad Arnaldo <muhammad.arnaldo@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
function RecentItem({ item, expanded }) {
  const title = new DOMParser().parseFromString(item.name, "text/html").body.textContent ?? "";
  return /* @__PURE__ */ jsxDEV("div", { className: "card mb-1", role: "listitem", style: expanded ? { display: "block" } : void 0, children: /* @__PURE__ */ jsxDEV("a", { href: item.viewurl, title, children: /* @__PURE__ */ jsxDEV("div", { className: "card-body p-2 m-1", children: /* @__PURE__ */ jsxDEV("div", { className: "d-flex text-truncate", children: [
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: "d-flex align-self-center activityiconcontainer",
        dangerouslySetInnerHTML: { __html: item.icon }
      },
      void 0,
      false,
      {
        fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentItem.tsx",
        lineNumber: 55,
        columnNumber: 25
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "w-100 line-height-3 text-truncate ms-2", children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "mb-0 text-truncate h6", children: /* @__PURE__ */ jsxDEV("span", { className: "clickable", dangerouslySetInnerHTML: { __html: item.name } }, void 0, false, {
        fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentItem.tsx",
        lineNumber: 60,
        columnNumber: 33
      }, this) }, void 0, false, {
        fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentItem.tsx",
        lineNumber: 59,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ jsxDEV("small", { className: "text-truncate mb-0", dangerouslySetInnerHTML: { __html: item.coursename } }, void 0, false, {
        fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentItem.tsx",
        lineNumber: 62,
        columnNumber: 29
      }, this)
    ] }, void 0, true, {
      fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentItem.tsx",
      lineNumber: 58,
      columnNumber: 25
    }, this)
  ] }, void 0, true, {
    fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentItem.tsx",
    lineNumber: 54,
    columnNumber: 21
  }, this) }, void 0, false, {
    fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentItem.tsx",
    lineNumber: 53,
    columnNumber: 17
  }, this) }, void 0, false, {
    fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentItem.tsx",
    lineNumber: 52,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentItem.tsx",
    lineNumber: 51,
    columnNumber: 9
  }, this);
}
__name(RecentItem, "RecentItem");
export {
  RecentItem as default
};
//# sourceMappingURL=RecentItem.dev.js.map
