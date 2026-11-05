<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Class definition for the Recently accessed items block.
 *
 * @package    block_recentlyaccesseditems
 * @copyright  2018 Victor Deniz <victor@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Recently accessed items block class.
 *
 * @package    block_recentlyaccesseditems
 * @copyright  Victor Deniz <victor@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class block_recentlyaccesseditems extends block_base {
    /**
     * Initialize class member variables
     */
    public function init() {
        $this->title = get_string('pluginname', 'block_recentlyaccesseditems');
    }

    /**
     * Returns the contents.
     *
     * @return stdClass contents of block
     */
    public function get_content() {
        global $OUTPUT;

        if (isset($this->content)) {
            return $this->content;
        }

        $props = [
            'loadinglabel' => get_string('loading', 'core'),
            'noitemslabel' => get_string('noitems', 'block_recentlyaccesseditems'),
            'moreitemslabel' => get_string('moreitems', 'block_recentlyaccesseditems'),
            'noitemsimgurl' => $OUTPUT
                ->image_url('items', 'block_recentlyaccesseditems')
                ->out(false),
        ];

        $this->content = (object) [
            'text' => \core\output\html_writer::react_component(
                '@moodle/lms/block_recentlyaccesseditems/RecentlyAccessedItems',
                $props,
            ),
            'footer' => '',
        ];
        return $this->content;
    }

    /**
     * Locations where block can be displayed.
     *
     * @return array
     */
    public function applicable_formats() {
        return ['my' => true];
    }
}
