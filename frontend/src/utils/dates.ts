
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

export function getSpoilData(d:Date, freezer: boolean) :SpoilData {
	const ret :SpoilData = {
		days: 0,
		text: '',
		ok: false,
		warn: false,
		spoiled: false
	}
	const spoil_day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	let delta = (spoil_day.valueOf() - today.valueOf()) /1000/60/60/24;
	delta = Math.round(delta);
	if( freezer ) {
		ret.text = `spoils in ${Math.round(delta/30)} months`;
		if( delta < 45 ) ret.text = `spoils in ${Math.round(delta/7)} weeks`;
		else if( delta < 7 ) ret.text = 'spoils this week';
		else if( delta < 0 ) ret.text = 'spoiled last week';
		else if( delta < -7 ) ret.text = `spoiled ${Math.round(-delta/7)} weeks ago`;
		else if( delta < -45 )ret.text = `spoiled ${Math.round(delta/30)} months ago`;

		ret.spoiled = delta < 0;
		ret.warn = delta <= 14 && !ret.spoiled;
		ret.ok = delta > 14;
	}
	else {
		ret.text = `spoils in ${delta} days`;
		if( delta === 1 ) ret.text = 'spoils tomorrow';
		else if( delta === 0 ) ret.text = 'spoils today!';
		else if( delta === -1 ) ret.text = 'spoiled yesterday';
		else if( delta < 0 ) ret.text = `spoiled ${-delta} days ago`;

		ret.spoiled = delta < 0;
		ret.warn = delta <= 1 && !ret.spoiled;
		ret.ok = delta > 1;
	}

	return ret;
}