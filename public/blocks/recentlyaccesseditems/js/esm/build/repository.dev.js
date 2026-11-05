var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
/**
 * Data access for the Recently accessed items block.
 *
 * @module     block_recentlyaccesseditems/repository
 * @copyright  2018 Victor Deniz <victor@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { fetchOne } from "@moodle/lms/core/ajax";
const getRecentItems = /* @__PURE__ */ __name((limit) => fetchOne({
  methodname: "block_recentlyaccesseditems_get_recent_items",
  args: { limit }
}), "getRecentItems");
export {
  getRecentItems
};
//# sourceMappingURL=repository.dev.js.map
