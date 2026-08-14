export const prerender = false;

export async function POST({ request, locals }: any) {
	const formData = await request.formData();
	const password = formData.get('password');
    const isProduction = import.meta.env.PROD;

    const cookie = [
	    'capsule_thesis_access=granted',
	    'Path=/thesis',
	    'HttpOnly',
	    'SameSite=Lax',
	    'Max-Age=86400',
	    isProduction ? 'Secure' : '',
    ]
	    .filter(Boolean)
	    .join('; ');

	const correctPassword =
		locals.runtime?.env?.THESIS_PASSWORD ??
		import.meta.env.THESIS_PASSWORD;

	if (
		typeof password !== 'string' ||
		!correctPassword ||
		password !== correctPassword
	) {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Incorrect access key.',
			}),
			{
				status: 401,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}

	return new Response(
		JSON.stringify({
			success: true,
		}),
		{
			headers: {
	            'Content-Type': 'application/json',
	            'Set-Cookie': cookie,
},
		}
	);
}