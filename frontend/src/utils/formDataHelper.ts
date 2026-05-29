import type { ISubmission } from '@/services/Submissions/typings';

interface FieldDef {
	key: string;
	label: string;
	type?: string;
}

export function getFieldLabel(submission: ISubmission | null | undefined, key: string): string {
	const fields: FieldDef[] = (submission?.form as any)?.schema?.fields ?? [];
	const field = fields.find((f) => f.key === key);
	return field?.label || key;
}

export function getReadableData(
	submission: ISubmission | null | undefined,
): Array<{ key: string; label: string; value: string }> {
	if (!submission?.data) return [];
	const fields: FieldDef[] = (submission?.form as any)?.schema?.fields ?? [];
	const fieldMap = new Map(fields.map((f) => [f.key, f]));

	return Object.entries(submission.data).map(([key, value]) => {
		const field = fieldMap.get(key);
		return {
			key,
			label: field?.label || key,
			value: formatValue(value, field?.type),
		};
	});
}

function formatValue(value: any, type?: string): string {
	if (value === null || value === undefined) return '';
	if (type === 'date' && typeof value === 'string') {
		try {
			const d = new Date(value);
			if (!isNaN(d.getTime())) {
				return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
			}
		} catch { /* fall through */ }
	}
	return String(value);
}
