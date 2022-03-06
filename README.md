# io.oreon.invoice-payment

![CI](https://github.com/Robin-Hoodie/invoice-payment/actions/workflows/code-quality.yml/badge.svg)

_Note: this is very much a work in progress_

Monorepo containing a web - and backend application which should make it possible to generate invoices which will contain a QR-code and/or link to allow payment to BTC addresses. These addresses will be derived from an extended public key.

Some code in this repository might not be used eventually, as I also see this as a pet project that'll teach me more about the technicals behind Bitcoin. (e.g. [secp256k1 math](packages/backend/src/wallet/secp256k1-math.ts))

## Installation

- Clone repo
- Run `yarn` to install deps

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

#### Future plans

- Add support for generation of BTC addresses based on TapRoot extended key (currently xpub and zpubs are supported)
- Add support for lightning payments
- Add support for Ether payments
- Prevent reuse of addresses by checking either a local or remote full node whether they contain any balance yet
- Notify recipient when payment's been received and had at least 1 confirmation
- ...
