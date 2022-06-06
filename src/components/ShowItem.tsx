import is from '@sindresorhus/is';
import type {HTMLMotionProps} from 'framer-motion';
import {motion} from 'framer-motion';

interface ShowItemProps extends HTMLMotionProps<'div'> {
	direction: 'up' | 'down' | 'left' | 'right';
	amount?: number;
	delay?: number;
}

export const SHOW_ITEM_DELAY_UNIT = 0.1;

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
		].filter(is.truthy),
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
