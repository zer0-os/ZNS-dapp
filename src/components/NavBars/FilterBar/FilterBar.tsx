//- React Imports
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

//- Style Imports
import styles from './FilterBar.module.css';

//- Component Imports
import { TextButton } from 'components';

//- Asset Imports
import wilderIcon from './assets/wilder-icon.png';

type FilterBarProps = {
	filters: string[];
	onSelect: (filter: string) => void;
	style?: React.CSSProperties;
	children?: React.ReactNode;
};

var lastY = 0; // Just a global variable to stash last scroll position

const FilterBar: React.FC<FilterBarProps> = ({
	filters,
	onSelect,
	style,
	children,
}) => {
	//- State
	const [selected, setSelected] = useState(filters.length ? filters[0] : '');

	//- Hooks
	const history = useHistory();

	// TODO: Move hidden header to a separate component
	const [hideHeader, setHideHeader] = useState(false);
	const handleScroll = () => {
		const hide = window.pageYOffset > 60 && window.pageYOffset > lastY;
		lastY = window.pageYOffset;
		setHideHeader(hide);
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const select = (filter: string) => {
		setSelected(filter);
		onSelect(filter);
	};

	const home = () => {
		history.push('/');
	};

	return (
		<nav
			className={`${styles.FilterBar} blur ${hideHeader ? styles.Hidden : ''}`}
			style={style}
		>
			{/* TODO: Move Wilder icon out of this component */}
			<div className={styles.Wilder}>
				<img alt="home icon" src={wilderIcon} onClick={home} />
			</div>
			{children}
			<ul>
				{filters.map((filter, index) => (
					<li key={index}>
						<TextButton
							onClick={() => select(filter)}
							selected={selected === filter}
						>
							{filter}
						</TextButton>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default FilterBar;
