/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BasklyLogoProps {
  className?: string;
  height?: number;
  width?: number;
  color?: string; // Kept for interface compatibility
}

export default function BasklyLogo({
  className = '',
  height,
  width,
  color
}: BasklyLogoProps) {
  return (
    <img
      src="https://res.cloudinary.com/dgy07glcb/image/upload/v1781694294/Group_1321315896gg_xqqco8.png"
      alt="Baskly Logo"
      className={`object-contain select-none ${className}`}
      style={{
        height: height !== undefined ? `${height}px` : undefined,
        width: width !== undefined ? `${width}px` : undefined,
      }}
      referrerPolicy="no-referrer"
    />
  );
}
