import test from 'node:test';import assert from 'node:assert/strict';
import {schoolYear,calendarYear} from '../assets/dates.js';
for(const [date,expected] of [['2026-07-14T16:00:00Z','25-26'],['2026-07-15T16:00:00Z','26-27'],['2026-10-24T16:00:00Z','26-27'],['2027-01-01T16:00:00Z','26-27'],['2027-07-14T16:00:00Z','26-27'],['2027-07-15T16:00:00Z','27-28'],['2026-07-15T03:59:59Z','25-26'],['2026-07-15T04:00:00Z','26-27']])test(date,()=>assert.equal(schoolYear(new Date(date)),expected));
test('full school year',()=>assert.equal(schoolYear(new Date('2026-10-24T12:00:00Z'),true),'2026-2027'));
test('calendar year uses New York midnight',()=>{assert.equal(calendarYear(new Date('2027-01-01T04:59:59Z')),2026);assert.equal(calendarYear(new Date('2027-01-01T05:00:00Z')),2027);});
