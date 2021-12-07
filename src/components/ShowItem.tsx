import {HTMLMotionProps, motion} from 'framer-motion';

type Falsy = false | 0 | 0n | '' | null | undefined;

type Truthy<T> = T extends Falsy ? never : T;

function isTruthy<T>(value: T): value is Truthy<T> {
  return Boolean(value);
}

interface ShowItemProps extends HTMLMotionProps<'div'> {
  direction: 'up' | 'down' | 'left' | 'right';
  amount?: number;
  delay?: number;
}

export const SHOW_ITEM_DELAY_UNIT = 0.1; // eslint-disable-line @typescript-eslint/naming-convention

const ShowItem = ({
  direction = 'up',
  amount = 20,
  delay = 0,
  children,
}: ShowItemProps) => {
  const initialPositionProp = Object.fromEntries(
    [
      direction === 'up' && (['y', amount] as const),
      direction === 'down' && (['y', -amount] as const),
      direction === 'left' && (['x', amount] as const),
      direction === 'right' && (['x', -amount] as const),
    ].filter(isTruthy),
  );

  return (
    <motion.div
      initial={{...initialPositionProp, opacity: 0}}
      animate={{x: 0, y: 0, opacity: 1}}
      transition={{delay}}
    >
      {children}
    </motion.div>
  );
};

export default ShowItem;
