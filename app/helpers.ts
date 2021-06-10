const date_format = [{year: 'numeric'}, {month: 'short'}, {day: 'numeric'} ];
export function dateStr(d:Date) {
	return date_format.map((m) => {
		const f = new Intl.DateTimeFormat('en', <Intl.DateTimeFormatOptions>m);
		return f.format(d);
	}).join('-');
}