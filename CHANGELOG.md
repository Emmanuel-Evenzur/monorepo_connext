# NXTP Changelog

## Next Release

- [sdk] Add `transactionReceipt` to all applicable events.

## 0.0.12

- [txservice] Bugfixes.

## 0.0.11

- [sdk] Fix for signature sending bug.
- [txservice] Fix for tx confirmed bug.
- [sdk] Add constructor param to skip setting up contract listeners.

## 0.0.10

- [router, sdk] Refactor error handling.
- [sdk] [#53](https://github.com/connext/nxtp/issues/53) Add `ReceiverPrepareSigned` event.
- [sdk] [#54](https://github.com/connext/nxtp/issues/54) Fix `finishTransfer` resolution.

## 0.0.9

- [sdk] Add methods to attach and detach listener.
- [sdk] Break up methods into `startTransfer` and `finishTransfer`.
- [router, sdk] Add getTransferQuote method and simulate auction request/response.

## 0.0.8
