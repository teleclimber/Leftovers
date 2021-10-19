import {dateStr } from './helpers.ts';
import { assertEquals, assert } from "https://deno.land/std@0.106.0/testing/asserts.ts";

Deno.test({
	name: "dateStr",
	//ignore: true,
	fn: () => {
		const d = new Date('December 17, 1995 03:24:00');
		const str = dateStr(d);
		assertEquals(str, '1995-Dec-17');

	}
});