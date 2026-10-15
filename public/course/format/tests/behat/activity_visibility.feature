@core @core_courseformat
Feature: Verify activity visibility interface.
  In order to edit the course activity visibility
  As a teacher
  I need to be able to see the updateds visibility information

  Background:
    Given the following "course" exists:
      | fullname         | Course 1 |
      | shortname        | C1       |
      | category         | 0        |
      | numsections      | 3        |
    And the following "activities" exist:
      | activity | name              | intro                       | course | idnumber | section | visible |
      | assign   | Activity sample 1 | Test assignment description | C1     | sample1  | 1       | 1       |
      | assign   | Activity sample 2 | Test assignment description | C1     | sample2  | 1       | 0       |
    And the following "users" exist:
      | username | firstname | lastname | email                |
      | teacher1 | Teacher   | 1        | teacher1@example.com |
    And the following "course enrolments" exist:
      | user     | course | role           |
      | teacher1 | C1     | editingteacher |
    Given I am on the "C1" "Course" page logged in as "teacher1"
    And I turn editing mode on

  @javascript
  Scenario: Teacher can hide an activity using the actions menu.
    Given I should not see "Hidden from students" in the "Activity sample 1" "activity"
    When I open "Activity sample 1" actions menu
    And I choose "Hide" in the open action menu
    Then I should see "Hidden from students" in the "Activity sample 1" "core_courseformat > Activity visibility"

  @javascript
  Scenario: Teacher can show an activity using the actions menu.
    Given I should see "Hidden from students" in the "Activity sample 2" "core_courseformat > Activity visibility"
    When I open "Activity sample 2" actions menu
    And I choose "Show" in the open action menu
    Then I should not see "Hidden from students" in the "Activity sample 2" "activity"

  @javascript
  Scenario: Teacher can make available but not shown an activity using the actions menu.
    Given the following config values are set as admin:
      | allowstealth | 1 |
    And I reload the page
    And I should see "Hidden from students" in the "Activity sample 2" "core_courseformat > Activity visibility"
    When I open "Activity sample 2" actions menu
    And I choose "Availability > Make available but don't show on course page" in the open action menu
    Then I should not see "Hidden from students" in the "Activity sample 2" "activity"
    And I should see "Available but not shown on course page" in the "Activity sample 2" "core_courseformat > Activity visibility"

  @javascript
  Scenario: Teacher can show an activity using the visibility badge.
    Given I should see "Hidden from students" in the "Activity sample 2" "core_courseformat > Activity visibility"
    When I click on "Hidden from students" "button" in the "Activity sample 2" "core_courseformat > Activity visibility"
    And I click on "Show on course page" "button"
    Then I should not see "Hidden from students" in the "Activity sample 2" "activity"

  @javascript
  Scenario: Teacher can make available but not shown an activity using the visibility badge.
    Given the following config values are set as admin:
      | allowstealth | 1 |
    And I reload the page
    When I click on "Hidden from students" "button" in the "Activity sample 2" "core_courseformat > Activity visibility"
    And I click on "Make available but don't show on course page" "button"
    Then I should not see "Hidden from students" in the "Activity sample 2" "activity"
    And I should see "Available but not shown on course page" in the "Activity sample 2" "core_courseformat > Activity visibility"

  @javascript
  Scenario: Make available but not shown is available only when stealth activities are enabled.
    Given I click on "Hidden from students" "button" in the "Activity sample 2" "core_courseformat > Activity visibility"
    And "Make available but don't show on course page" "button" should not exist
    When the following config values are set as admin:
      | allowstealth | 1 |
    And I reload the page
    And I click on "Hidden from students" "button" in the "Activity sample 2" "core_courseformat > Activity visibility"
    Then "Make available but don't show on course page" "button" should exist

  @javascript
  Scenario: Teacher can hide a shown activity using the visibility dropdown.
    Given I should see "Visible" in the "Activity sample 1" "core_courseformat > Activity visibility"
    When I click on "Visible on course page" "button" in the "Activity sample 1" "core_courseformat > Activity visibility"
    And I click on "Hide on course page" "button"
    Then I should see "Hidden" in the "Activity sample 1" "core_courseformat > Activity visibility"
    And I should see "Hidden from students" in the "Activity sample 1" "core_courseformat > Activity visibility"

  @javascript
  Scenario: The visibility labels are only displayed in edit mode.
    Given I should see "Hidden" in the "Activity sample 2" "core_courseformat > Activity visibility"
    When I turn editing mode off
    Then "Activity sample 1" "core_courseformat > Activity visibility" should not exist
    And "Activity sample 2" "core_courseformat > Activity visibility" should exist
    And ".activity-visibility-label" "css_element" should not exist in the "Activity sample 2" "activity"
