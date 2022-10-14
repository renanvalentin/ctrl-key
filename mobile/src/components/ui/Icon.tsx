import React from 'react';
import { Icon as KittenIcon } from '@ui-kitten/components';

interface Props {
  name: string;
  style: Record<string, string>;
  fill?: string;
}

export const Icon = ({
  name,
  style: { tintColor, fillColor, ...styles },
  fill,
}: Props) => (
  <KittenIcon
    name={name}
    style={{ ...styles }}
    fill={fill || tintColor || fillColor}
  />
);
