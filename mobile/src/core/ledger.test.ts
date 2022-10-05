import { firstValueFrom } from 'rxjs';
import type { DescriptorEvent, Device, Observer } from '@ledgerhq/hw-transport';
import { DeviceConnected, LedgerConnector, MonitorState } from './ledger';
import type {
  GetVersionResponse,
  Version,
  DeviceCompatibility,
  Serial,
  ExtendedPublicKey,
} from '@cardano-foundation/ledgerjs-hw-app-cardano';

const descriptor = {
  id: 'BED98F82',
  isConnectable: true,
  manufacturerData: null,
  serviceData: null,
  localName: 'Nano X 85CA',
  solicitedServiceUUIDs: null,
  overflowServiceUUIDs: null,
  serviceUUIDs: ['13d63400'],
  rssi: -92,
  txPowerLevel: null,
  mtu: 23,
  name: 'Nano X 85CA',
};

const device = {
  id: 'nanoX',
  productName: 'Ledger Nano X',
  productIdMM: 64,
  legacyUsbProductId: 4,
  usbOnly: false,
  memorySize: 2097152,
  masks: [855638016],
  bluetoothSpec: [
    {
      serviceUuid: '13d63400',
      notifyUuid: '13d63400',
      writeUuid: '13d63400',
      writeCmdUuid: '13d63400',
    },
  ],
};

jest.mock('@ledgerhq/react-native-hw-transport-ble', () => ({
  __esModule: true,
  default: {
    listen: (observer: Observer<DescriptorEvent<Device>>) => {
      observer.next({
        type: 'add',
        descriptor,
        device,
      });

      observer.complete();
    },
    open: jest.fn(),
  },
}));

const version: Version = {
  flags: {
    isDebug: true,
  },
  major: 5,
  minor: 0,
  patch: 0,
};

const deviceCompatibility: DeviceCompatibility = {
  isCompatible: true,
  recommendedVersion: null,
  supportsAlonzo: true,
  supportsBabbage: true,
  supportsCatalystRegistration: true,
  supportsMary: true,
  supportsMint: true,
  supportsMultisigTransaction: true,
  supportsNativeScriptHashDerivation: true,
  supportsPoolRegistrationAsOperator: true,
  supportsPoolRetirement: true,
  supportsReqSignersInOrdinaryTx: true,
  supportsZeroTtl: true,
};

const serial: Serial = {
  serialHex: '123',
};

const chainCodeHex =
  'bda8a3eb120ba26f5a5982742ee6a8b770520b0c4ad80bce403154ce7eb589d1';

const publicKeyHex =
  '4b899d0cbbebeb6166a8ac3a71112e85e2db566facec0fdb502f38283c6fd56f';

jest.mock('@cardano-foundation/ledgerjs-hw-app-cardano', () => {
  class Ada {
    getVersion = (): Promise<GetVersionResponse> =>
      Promise.resolve({ version, compatibility: deviceCompatibility });
    getSerial = (): Promise<Serial> => Promise.resolve(serial);
    getExtendedPublicKey = (): Promise<ExtendedPublicKey> =>
      Promise.resolve({ chainCodeHex, publicKeyHex });
    get transport() {
      return {
        close: jest.fn(),
      };
    }
  }

  return {
    __esModule: true,
    ...jest.requireActual('@cardano-foundation/ledgerjs-hw-app-cardano'),
    Ada,
  };
});

it('detect device', async () => {
  const monitor$ = LedgerConnector.monitor();
  const deviceConnected = (await firstValueFrom(monitor$)) as DeviceConnected;

  expect(deviceConnected).toEqual({
    type: MonitorState.Found,
    device,
    descriptor,
  });
});

it('export extend public key', async () => {
  const monitor$ = LedgerConnector.monitor();

  const deviceConnected = (await firstValueFrom(monitor$)) as DeviceConnected;

  const deviceInfo = await LedgerConnector.exportExtendedPublicKey(
    deviceConnected.descriptor,
  );

  expect(deviceInfo).toEqual({
    chainCodeHex,
    publicKeyHex,
    serialHex: serial.serialHex,
    version,
    compatibility: deviceCompatibility,
  });
});
