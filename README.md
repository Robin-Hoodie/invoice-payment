# io.oreon.invoice-payment

![CI](https://github.com/Robin-Hoodie/invoice-payment/actions/workflows/code-quality.yml/badge.svg)

Small web application in which we display generated (SegWit) addresses that can be used to complete payment for a particular invoice.

These addresses are to be derived from a supplied xpub or zpub key. In the future I plan to also support extended keys that can generate Taproot addresses.

Some code in this repository might not be used eventually, as I also see this as a pet project that'll teach me more about the technicals behind Bitcoin.

## Backend

### MongoDB

The database is set up w/ a root user, which executes an initialization script on a database specific to this project.
The first part of this script is setting up a separate admin user, with its rights limited to said database.

To manage this, we use 2 environment files:

### `.env.mongo` file

An example of this can be found at [packages/backend/.env.mongo.example](packages/backend/.env.mongo.example)

This is used exclusively for loading environment variables in the MongoDB container

The credentials of the root user are included in this file.
This also includes environment variables used for [seeding the database](packages/backend/mongodb/seed/index.sh)

### `.env` file

An example of this can be found at [packages/backend/.env.example](packages/backend/.env.example)

This used by both the application and the MongoDB container.

In this file the credentials of the dedicated admin user for the application database are included, as well as the application database name itself.<br/>
We need these environment variables in the MongoDB container as these are used for creating the application database and its dedicated admin user.<br/>
We need these environment variables in the application as they are used for connecting to the MongoDB container.

More info on the above can be found in [the mongo image docs](https://hub.docker.com/_/mongo) & [the mongo docs](https://docs.mongodb.com/manual/security/)
