export const copyTextToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text);

		return true;
	} catch {
		return document.execCommand('copy', true, text);
	}
};
