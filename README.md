[![Netlify Status](https://api.netlify.com/api/v1/badges/e6315d69-80ac-476a-afa2-45ee090a300b/deploy-status)](https://app.netlify.com/projects/jdi-coding/deploys)

# Project Overview

This project is a static website built using HTML, CSS, and JavaScript.
The JavaScript layer is implemented using jQuery.

## Live Environments

* **Production [(PROD)](https://jdi-coding.netlify.app/)**
* **Staging [(STAGE)](https://jdi-coding.github.io/aboutme/)**

## Branching & Deployment Strategy

### Production Branch (`PROD`)

* Hosted on Netlify
* Contains only stable and production-ready code
* Represents the current live version of the website

### Staging Branch (`staging`)

* Used for testing and previewing new changes
* All updates are deployed here before going to production
* Acts as the integration layer between feature development and production

### Feature Branches

* All other branches are considered feature branches
* Development happens locally (localhost)
* Feature branches are merged into `staging` for testing
* Once validated, changes can be promoted from `staging` to `PROD`

## Deployment Flow

1. Develop features locally in feature branches
2. Merge feature branches into `staging`
3. Validate changes in the staging environment
4. Promote stable changes from `staging` to `PROD`
5. Netlify deploys the production version automatically

## Tech Stack

* HTML (Static)
* CSS
* JavaScript
* jQuery

