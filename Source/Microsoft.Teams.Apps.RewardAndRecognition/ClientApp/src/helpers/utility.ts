
export const isNullorWhiteSpace = (input: string): boolean => {
	return !input || !input.trim();
}

export const checkUrl = (url: string) => {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}