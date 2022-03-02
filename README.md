# io.oreon.invoice-payment

![CI](https://github.com/Robin-Hoodie/invoice-payment/actions/workflows/code-quality.yml/badge.svg)

Small web application in which we display generated (SegWit) addresses that can be used to complete payment for a particular invoice.

These addresses are to be derived from a supplied xpub or zpub key. In the future I plan to also support extended keys that can generate Taproot addresses.

Some code in this repository might not be used eventually, as I also see this as a pet project that'll teach me more about the technicals behind Bitcoin.

## Backend

### MongoDB

The database is set up w/ a root user, which executes an initialization script on a database specific to this project.
The first part of this script is setting up a separate admin user, with its rights limited to said database.
The credentials of the root user, the database name, and the credentials of the database admin user, can be set via an env file which should be named `.env` located in the `packages/backend` directory. An example env file can be found at [packages/backend/.env.example](packages/backend/.env.example).

More info on this can be found in [the mongo image docs](https://hub.docker.com/_/mongo) & [the mongo docs](https://docs.mongodb.com/manual/security/)
