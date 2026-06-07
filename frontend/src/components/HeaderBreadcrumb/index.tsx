// design: smartadmin.pen · DS Topbar (qYE1c) — "Trang chủ / <Trang>"
import React from 'react';
import { history, useLocation } from 'umi';
import routes from '../../../config/routes';
import styles from './index.less';

interface IFlatRoute {
	pattern: RegExp;
	specificity: number;
	names: string[];
}

const flatten = (items: any[], parents: string[] = []): IFlatRoute[] =>
	items.flatMap((r) => {
		if (!r?.path) return r?.routes ? flatten(r.routes, parents) : [];
		const names = r.name ? [...parents, r.name] : parents;
		const own: IFlatRoute[] = r.name
			? [
					{
						pattern: new RegExp(`^${r.path.replace(/:[^/]+/g, '[^/]+')}/?$`),
						specificity: r.path.length,
						names,
					},
			  ]
			: [];
		return [...own, ...(r.routes ? flatten(r.routes, names) : [])];
	});

const FLAT_ROUTES = flatten(routes as any[]);

const HeaderBreadcrumb: React.FC = () => {
	const { pathname } = useLocation();

	const match = FLAT_ROUTES.filter((r) => r.pattern.test(pathname)).sort(
		(a, b) => b.specificity - a.specificity,
	)[0];

	// bỏ trùng khi route con cùng tên route cha
	const names = match ? match.names.filter((n, i, arr) => n !== arr[i - 1]) : [];

	return (
		<div className={styles.breadcrumb}>
			<span className={styles.root} onClick={() => history.push('/dashboard')}>
				Trang chủ
			</span>
			{names.map((n) => (
				<React.Fragment key={n}>
					<span className={styles.sep}>/</span>
					<span className={styles.current}>{n}</span>
				</React.Fragment>
			))}
		</div>
	);
};

export default HeaderBreadcrumb;
