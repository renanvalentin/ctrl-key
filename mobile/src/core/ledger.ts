import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import {
  ExtendedPublicKey,
  GetVersionResponse,
  Serial,
  utils as adaUtils,
  Ada,
} from '@cardano-foundation/ledgerjs-hw-app-cardano';
import { Observable } from 'rxjs';

export enum MonitorState {
  Connecting,
  Error,
  Found,
}

export interface Descriptor {
  isConnectable: boolean;
  manufacturerData: unknown;
  id: string;
  serviceData: unknown;
  localName: string;
  solicitedServiceUUIDs: unknown;
  overflowServiceUUIDs: unknown;
  serviceUUIDs: string[];
  rssi: number;
  txPowerLevel: unknown;
  name: string;
  mtu: number;
}

interface BluetoothSpec {
  serviceUuid: string;
  notifyUuid: string;
  writeUuid: string;
  writeCmdUuid: string;
}

export interface Device {
  id: string;
  productName: string;
  productIdMM: number;
  legacyUsbProductId: number;
  usbOnly: boolean;
  memorySize: number;
  masks: number[];
  bluetoothSpec: BluetoothSpec[];
}

export interface DeviceConnected {
  type: MonitorState.Found;
  device?: Device;
  descriptor: Descriptor;
}

export type Cases =
  | {
      type: MonitorState.Connecting;
    }
  | DeviceConnected
  | {
      type: MonitorState.Error;
      error: string;
    };

export interface Version {}

export type DeviceInfo = Serial & GetVersionResponse & ExtendedPublicKey;

export class LedgerConnector {
  static monitor(): Observable<Cases> {
    const observable = new Observable<Cases>(function subscribe(subscriber) {
      const bleSubscription = TransportBLE.listen({
        complete: () => {
          subscriber.complete();
        },
        next: e => {
          if (e.type === 'add') {
            subscriber.next({
              type: MonitorState.Found,
              descriptor: e.descriptor,
              device: e.device,
            });
            bleSubscription.unsubscribe();
            subscriber.complete();
          }
        },
        error: error => {
          subscriber.next({
            type: MonitorState.Error,
            error,
          });
        },
      });
      return function unsubscribe() {
        bleSubscription.unsubscribe();
      };
    });

    return observable;
  }

  static async exportExtendedPublicKey(
    descriptor: Descriptor,
  ): Promise<DeviceInfo> {
    const transport = await TransportBLE.open(descriptor.id);
    const appAda = new Ada(transport);

    const { compatibility, version } = await appAda.getVersion();
    const { serialHex } = await appAda.getSerial();

    const { chainCodeHex, publicKeyHex } = await appAda.getExtendedPublicKey({
      path: adaUtils.str_to_path("1852'/1815'/0'"),
    });

    appAda.transport.close();

    return {
      compatibility,
      version,
      serialHex,
      chainCodeHex,
      publicKeyHex,
    };
  }
}
