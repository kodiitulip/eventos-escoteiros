import Image from 'next/image';
import scoutLogoFull from '@/assets/scout-logo.png';
import scoutLogoX512 from '@/assets/scout-logo-x512.png';
import scoutLogoX256 from '@/assets/scout-logo-x256.png';
import scoutLogoX128 from '@/assets/scout-logo-x128.png';

type Props = {
  className?: string;
};

export const ScoutLogoFull = (props: Props) => (
  <Image
    src={scoutLogoFull}
    width={1920}
    height={1920}
    alt='Logo'
    {...props}
  />
);

export const ScoutLogoX512 = (props: Props) => (
  <Image
    src={scoutLogoX512}
    width={512}
    height={512}
    alt='Logo'
    {...props}
  />
);

export const ScoutLogoX256 = (props: Props) => (
  <Image
    src={scoutLogoX256}
    width={256}
    height={256}
    alt='Logo'
    {...props}
  />
);

export const ScoutLogoX128 = (props: Props) => (
  <Image
    src={scoutLogoX128}
    width={128}
    height={128}
    alt='Logo'
    {...props}
  />
);
