var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * Activity visibility dropdown displayed on every activity card in edit mode.
 *
 * @module     core_course/local/cm/VisibilityDropdown
 * @copyright  2026 Muhammad Arnaldo <muhammad.arnaldo@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useRef, useState } from "react";
import { Dropdown, DropdownItemSelect } from "@moodlehq/design-system";
import { requireAsync } from "@moodle/lms/core/amd";
import Pending from "@moodle/lms/core/pending";
const pendingFocus = /* @__PURE__ */ new Set();
function VisibilityDropdown({ cmid, state, label, accessiblename, icon, options }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const itemRefs = useRef([]);
  const getTrigger = /* @__PURE__ */ __name(() => dropdownRef.current?.querySelector(".activity-visibility-trigger"), "getTrigger");
  useEffect(() => {
    if (pendingFocus.delete(cmid)) {
      getTrigger()?.focus();
    }
  }, [cmid]);
  useEffect(() => {
    if (!open) {
      return void 0;
    }
    const selectedIndex = options.findIndex((option) => option.selected);
    if (selectedIndex <= 0) {
      return void 0;
    }
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => itemRefs.current[selectedIndex]?.focus());
    });
    return () => cancelAnimationFrame(frame);
  }, [open, options]);
  const closeMenu = /* @__PURE__ */ __name(() => {
    setOpen(false);
    getTrigger()?.focus();
  }, "closeMenu");
  const handleKeyDown = /* @__PURE__ */ __name((event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      closeMenu();
      return;
    }
    const items = itemRefs.current.filter((item) => item !== null);
    const current = items.indexOf(document.activeElement);
    let wrapTo = null;
    if (event.key === "ArrowDown" && current === items.length - 1) {
      wrapTo = items[0];
    } else if (event.key === "ArrowUp" && current === 0) {
      wrapTo = items[items.length - 1];
    }
    if (wrapTo) {
      event.preventDefault();
      event.stopPropagation();
      wrapTo.focus();
    }
  }, "handleKeyDown");
  const selectOption = /* @__PURE__ */ __name((option) => {
    closeMenu();
    if (!option.action) {
      return;
    }
    if (!option.selected) {
      pendingFocus.add(cmid);
    }
    const pending = new Pending(`core_course/VisibilityDropdown:${cmid}`);
    requireAsync("core_courseformat/courseeditor").then((courseEditor) => {
      return courseEditor.getCurrentCourseEditor().dispatch(option.action, [cmid]);
    }).catch(() => {
      pendingFocus.delete(cmid);
    }).finally(() => {
      pending.resolve();
    });
  }, "selectOption");
  const trigger = /* @__PURE__ */ jsxDEV(
    "button",
    {
      type: "button",
      className: [
        "mds-btn btn btn-outline-secondary mds-btn--size-md mds-dropdown-trigger activity-visibility-trigger",
        open ? "mds-dropdown-trigger--open" : ""
      ].join(" ").trim(),
      "data-visibility": state,
      children: [
        /* @__PURE__ */ jsxDEV("span", { className: "activity-visibility-icon", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: icon } }, void 0, false, {
          fileName: "public/course/js/esm/src/local/cm/VisibilityDropdown.tsx",
          lineNumber: 158,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "activity-visibility-label", "aria-hidden": "true", children: label }, void 0, false, {
          fileName: "public/course/js/esm/src/local/cm/VisibilityDropdown.tsx",
          lineNumber: 159,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "visually-hidden", children: accessiblename }, void 0, false, {
          fileName: "public/course/js/esm/src/local/cm/VisibilityDropdown.tsx",
          lineNumber: 160,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("i", { className: "mds-dropdown-trigger__chevron", "aria-hidden": "true" }, void 0, false, {
          fileName: "public/course/js/esm/src/local/cm/VisibilityDropdown.tsx",
          lineNumber: 161,
          columnNumber: 13
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "public/course/js/esm/src/local/cm/VisibilityDropdown.tsx",
      lineNumber: 150,
      columnNumber: 9
    },
    this
  );
  return /* @__PURE__ */ jsxDEV(Dropdown, { ref: dropdownRef, trigger, open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxDEV("div", { role: "none", className: "activity-visibility-menu", onKeyDown: handleKeyDown, children: options.map((option, index) => /* @__PURE__ */ jsxDEV(
    DropdownItemSelect,
    {
      ref: (element) => {
        itemRefs.current[index] = element;
      },
      label: option.label,
      description: option.description,
      selected: option.selected,
      startIcon: /* @__PURE__ */ jsxDEV(
        "i",
        {
          className: "activity-visibility-option-icon",
          "aria-hidden": "true",
          dangerouslySetInnerHTML: { __html: option.icon }
        },
        void 0,
        false,
        {
          fileName: "public/course/js/esm/src/local/cm/VisibilityDropdown.tsx",
          lineNumber: 178,
          columnNumber: 29
        },
        this
      ),
      "data-value": option.value,
      onClick: () => selectOption(option)
    },
    option.value,
    false,
    {
      fileName: "public/course/js/esm/src/local/cm/VisibilityDropdown.tsx",
      lineNumber: 169,
      columnNumber: 21
    },
    this
  )) }, void 0, false, {
    fileName: "public/course/js/esm/src/local/cm/VisibilityDropdown.tsx",
    lineNumber: 167,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "public/course/js/esm/src/local/cm/VisibilityDropdown.tsx",
    lineNumber: 166,
    columnNumber: 9
  }, this);
}
__name(VisibilityDropdown, "VisibilityDropdown");
export {
  VisibilityDropdown as default
};
//# sourceMappingURL=VisibilityDropdown.dev.js.map
