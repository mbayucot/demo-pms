// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
import "@testing-library/cypress/add-commands";
import "cypress-file-upload";

import "./localStorage";
import "./login";
import "./modal";
import "./table";
import "./search";

import "./project";
import "./task";
