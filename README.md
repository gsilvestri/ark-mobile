# Kapu Mobile

<p align="center">
    <img src="./banner.jpg" />
</p>

> A Wallet for Everyone

[![Build Status](https://badgen.now.sh/circleci/github/gsilvestri/kapu-mobile)](https://circleci.com/gh/gsilvestri/kapu-mobile)
[![Codecov](https://badgen.now.sh/codecov/c/github/gsilvestri/kapu-mobile)](https://codecov.io/gh/gsilvestri/kapu-mobile)
[![Latest Version](https://badgen.now.sh/github/release/gsilvestri/kapu-mobile)](https://github.com/gsilvestri/kapu-mobile/releases/latest)
[![License: MIT](https://badgen.now.sh/badge/license/MIT/green)](https://opensource.org/licenses/MIT)

KAPU’s mobile wallet is a hybrid application (using the same codebase for Android and iOS which helps with coordinated development). Created using Ionic framework and ARK’s [TypeScript API](https://github.com/ArkEcosystem/ark-ts) to interact with the KAPU network via your mobile phone, anytime, anywhere (as long as you have an internet connection).

## Download

- [Google Play](https://play.google.com/store/apps/details?id=io.kapu.wallet.mobile)

## Features

- Import your existing passphrase (import by QR Scanner or write/paste your passphrase).
- Generate a new passphrase.
- Encrypt access to your profile with a custom 6 digit PIN (AES256+PBKDF2).
- Most transaction types are available: send, receive, vote, unvote, register a delegate.
- Connects to both mainnet and devnet.
- Option for additional profiles (separate profiles for different KAPU addresses or networks).
- Option to add contacts and easily transact with them.
- Total balance of your combined KAPU addresses.
- Wallet backup - input your selected PIN to decrypt your wallet and gain view of your private data.
- Change PIN - if you want to change your encryption/decryption PIN you can easily do so..
- Clear Data — you can clear all your data from the phone.
- Overview of network status with an option to change peer.
- Current market value, along with weekly movements.
- Support for showing data in different FIAT currencies.

## Build

First follow the steps below to install the dependencies:

```bash
$ npm install -g ionic cordova@7.1.0
$ npm install
$ ionic cordova prepare
```

Run on device:

```bash
$ ionic cordova run ios
$ ionic cordova run android
```

Debug in browser:

```bash
$ npm run ionic:serve
```

## Testing

To run the unit tests:
```bash
$ npm test
```

To run the unit tests and watch them:
```bash
$ npm run test:unit
```

To run the unit tests and generate a coverage report:
```bash
$ npm run test:coverage
```

To run the E2E (end to end) tests:
```bash
$ npm run test:e2e
```

## Security

If you discover a security vulnerability within this application, please send an e-mail to security@ark.io. All security vulnerabilities will be promptly addressed.

## Contributing

- If you find any bugs, submit an [issue](../../issues) or open [pull-request](../../pulls), helping us catch and fix them.
- Engage with other users and developers on [KAPU Slack](https://slack.kapu.one/).
- Join to our [gitter](https://gitter.im/kapu-developers/Lobby).
- [Contribution bounties](https://docs.ark.io/guidebook/contribution-guidelines/contributing.html).
- [Help translate](./TRANSLATING.md).

## Authors

- [Lúcio Rubens](https://github.com/luciorubeens)
- [Alex Barnsley](https://github.com/alexbarnsley)
- [Nicola Boldrin](https://github.com/nboldrin)
- [Bledar Gogaj](https://github.com/gobled)
- [All Contributors](../../contributors)

## License

[MIT](LICENSE) © [Kapu International](https://kapu.one)
