var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * React frontend for the Recently accessed items block.
 *
 * @module     block_recentlyaccesseditems/RecentlyAccessedItems
 * @copyright  2018 Victor Deniz <victor@moodle.com>
 * @copyright  2026 Muhammad Arnaldo <muhammad.arnaldo@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@moodlehq/design-system";
import { requireAsync } from "@moodle/lms/core/amd";
import log from "@moodle/lms/core/log";
import EmptyState from "@moodle/lms/block_recentlyaccesseditems/EmptyState";
import RecentItem from "@moodle/lms/block_recentlyaccesseditems/RecentItem";
import { getRecentItems } from "@moodle/lms/block_recentlyaccesseditems/repository";
const MAX_ITEMS = 9;
function LoadingState({ label }) {
  return /* @__PURE__ */ jsxDEV("div", { "data-region": "recentlyaccesseditems-loading-placeholder", role: "status", children: [
    /* @__PURE__ */ jsxDEV("span", { className: "visually-hidden", children: label }, void 0, false, {
      fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
      lineNumber: 69,
      columnNumber: 13
    }, this),
    Array.from({ length: 5 }, (_, index) => /* @__PURE__ */ jsxDEV("div", { className: "card mb-1", "aria-hidden": "true", children: /* @__PURE__ */ jsxDEV("div", { className: "card-body p-2 m-1", children: /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-row mw-100 align-items-center", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-pulse-grey rounded-circle", style: { height: 40, width: 40 } }, void 0, false, {
        fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
        lineNumber: 74,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "ps-2 flex-grow-1", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-pulse-grey w-100", style: { height: "1rem" } }, void 0, false, {
          fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
          lineNumber: 76,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-pulse-grey w-75 mt-1", style: { height: "0.8rem" } }, void 0, false, {
          fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
          lineNumber: 77,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
        lineNumber: 75,
        columnNumber: 29
      }, this)
    ] }, void 0, true, {
      fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
      lineNumber: 73,
      columnNumber: 25
    }, this) }, void 0, false, {
      fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
      lineNumber: 72,
      columnNumber: 21
    }, this) }, index, false, {
      fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
      lineNumber: 71,
      columnNumber: 17
    }, this))
  ] }, void 0, true, {
    fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
    lineNumber: 68,
    columnNumber: 9
  }, this);
}
__name(LoadingState, "LoadingState");
function RecentlyAccessedItems({ noitemsimgurl, loadinglabel, noitemslabel, moreitemslabel }) {
  const [state, setState] = useState({ status: "loading" });
  const [expanded, setExpanded] = useState(false);
  const root = useRef(null);
  const listId = useId();
  useEffect(() => {
    let active = true;
    getRecentItems(MAX_ITEMS).then((items) => {
      if (active) {
        setState({ status: "loaded", items });
      }
      return null;
    }).catch((error) => {
      if (active) {
        setState({ status: "error", error });
      }
    });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    let active = true;
    if (state.status === "loaded") {
      requireAsync("core_filters/events").then((events) => {
        if (active && root.current) {
          events.notifyFilterContentUpdated([root.current]);
        }
        return null;
      }).catch((error) => log.error(error));
    } else if (state.status === "error") {
      requireAsync("core/notification").then((notification) => {
        if (active) {
          return notification.exception(state.error);
        }
        return void 0;
      }).catch((error) => log.error(error));
    }
    return () => {
      active = false;
    };
  }, [state]);
  useEffect(() => {
    if (expanded) {
      root.current?.querySelector('[role="listitem"]:nth-child(4) a')?.focus();
    }
  }, [expanded]);
  return /* @__PURE__ */ jsxDEV("div", { ref: root, className: "block-recentlyaccesseditems block-cards", "data-region": "recentlyaccesseditems", children: /* @__PURE__ */ jsxDEV("div", { className: "container-fluid p-0", "data-region": "recentlyaccesseditems-view", "aria-busy": state.status === "loading", children: /* @__PURE__ */ jsxDEV("div", { "data-region": "recentlyaccesseditems-view-content", children: [
    state.status === "loading" && /* @__PURE__ */ jsxDEV(LoadingState, { label: loadinglabel }, void 0, false, {
      fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
      lineNumber: 157,
      columnNumber: 52
    }, this),
    state.status === "loaded" && (state.items.length === 0 ? /* @__PURE__ */ jsxDEV(EmptyState, { noitemsimgurl, message: noitemslabel }, void 0, false, {
      fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
      lineNumber: 159,
      columnNumber: 25
    }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV("div", { id: listId, "data-region": "items-list", role: "list", children: state.items.map((item) => /* @__PURE__ */ jsxDEV(RecentItem, { item, expanded }, item.id, false, {
        fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
        lineNumber: 163,
        columnNumber: 58
      }, this)) }, void 0, false, {
        fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
        lineNumber: 162,
        columnNumber: 29
      }, this),
      state.items.length > 3 && !expanded && /* @__PURE__ */ jsxDEV("div", { "data-region": "more-items-button-container", className: "mt-2 px-1", children: /* @__PURE__ */ jsxDEV(
        Button,
        {
          label: moreitemslabel,
          variant: "secondary",
          size: "md",
          "data-action": "more-items",
          "aria-controls": listId,
          onClick: () => setExpanded(true)
        },
        void 0,
        false,
        {
          fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
          lineNumber: 167,
          columnNumber: 37
        },
        this
      ) }, void 0, false, {
        fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
        lineNumber: 166,
        columnNumber: 33
      }, this)
    ] }, void 0, true, {
      fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
      lineNumber: 161,
      columnNumber: 25
    }, this))
  ] }, void 0, true, {
    fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
    lineNumber: 156,
    columnNumber: 17
  }, this) }, void 0, false, {
    fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
    lineNumber: 155,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "public/blocks/recentlyaccesseditems/js/esm/src/RecentlyAccessedItems.tsx",
    lineNumber: 154,
    columnNumber: 9
  }, this);
}
__name(RecentlyAccessedItems, "RecentlyAccessedItems");
export {
  RecentlyAccessedItems as default
};
//# sourceMappingURL=RecentlyAccessedItems.dev.js.map
