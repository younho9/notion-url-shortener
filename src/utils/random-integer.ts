export const randomInteger = (minimum = 0, maximum = minimum) =>
	Math.floor((Math.random() * (maximum - minimum + 1)) + minimum);
