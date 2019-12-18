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

   Scenario: Email format is valid
     Given I fill the register form field
     When  I put my email address in the email field
     Then  Verify the email format is correct

   Scenario: The password is 6 at least six digits minimum
     Given I fill the register form fields
     When  I insert the password
     Then  valid the password length

   Scenario: Client give twice the password for confirmation
     Given I fill the register form field
     When I put my password
     Then Ask to insert the password again in the next field
     And  Validate password insert twice are identicallys same

   Scenario: Client give twice email address for confirmation
     Given I fill the register form field
     When I put my email address
     Then Ask to insert the email address again in the next field
     And  Validate email address insert twice are identicallys same

