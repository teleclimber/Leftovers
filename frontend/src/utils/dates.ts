
export function getDateAfterDays(start_date:Date, days:Number) :Date {
	const ret = new Date(start_date.valueOf());
	ret.setDate(ret.getDate() + Number(days));
	return ret;
}
export function getDaysBetween(start_date :Date, end_date : Date) :number {
	return Math.round((end_date.valueOf() - start_date.valueOf()) /1000/60/60/24);
}

export type SpoilData = {
	days: number,
	text: string,
	ok: boolean,
	warn: boolean,
	spoiled: boolean
}

export function getSpoilData(d:Date) :SpoilData {
	const spoil_day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	let delta = (spoil_day.valueOf() - today.valueOf()) /1000/60/60/24;
	delta = Math.round(delta);
	let str = `spoils in ${delta} days`;
	if( delta === 1 ) str = 'spoils tomorrow';
	else if( delta === 0 ) str = 'spoils today!';
	else if( delta === -1 ) str = 'spoiled yesterday';
	else if( delta < 0 ) str = `spoiled ${-delta} days ago`;

	const spoiled = delta < 0;
	const warn = delta <= 1 && !spoiled;
	const ok = delta > 1;

	return {
		days: delta,
		text: str,
		ok,
		warn,
		spoiled
	};
}