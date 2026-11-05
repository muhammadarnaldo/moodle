import{fetchOne as t}from"@moodle/lms/core/ajax";/**
 * Data access for the Recently accessed items block.
 *
 * @module     block_recentlyaccesseditems/repository
 * @copyright  2018 Victor Deniz <victor@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const c=e=>t({methodname:"block_recentlyaccesseditems_get_recent_items",args:{limit:e}});export{c as getRecentItems};
