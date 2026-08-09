export function isLibrarianOnDuty(date = new Date()) {
	const parts = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Europe/London',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	}).formatToParts(date);

	const hour = Number(
		parts.find((part) => part.type === 'hour')?.value ?? '0'
	);

	const minute = Number(
		parts.find((part) => part.type === 'minute')?.value ?? '0'
	);

	const minutesNow = hour * 60 + minute;

	const openingTime = 10 * 60; // 10:00
	const closingTime = 22 * 60; // 22:00

	return (
		minutesNow >= openingTime &&
		minutesNow < closingTime
	);
}