import { api } from '../blockfrost';

interface Props {
  readonly slot: number;
}

export interface BlockModel extends Props {}

export class Block implements BlockModel {
  readonly slot: number;

  constructor(params: Props) {
    this.slot = params.slot;
  }

  static async latest(): Promise<BlockModel> {
    const block = await api.blocksLatest();
    return new Block({
      slot: block.slot as number,
    });
  }
}
