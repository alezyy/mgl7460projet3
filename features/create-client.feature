Feature: Create a client
  As a shopper
  I want to create new account
  So that I can reconnect at the store before purchase

  Background: Client register page is open
    Given I have opened the register form

  Scenario: Email address doesn't exist in the database
    Given I have opened the register form
    When  I put my email address in the email fields
    Then  The system check the email is unique

