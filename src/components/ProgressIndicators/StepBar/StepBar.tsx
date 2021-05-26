import React from 'react';

import styles from './StepBar.module.css';

type StepBarProps = {
	step: number;
	steps: string[];
	style?: React.CSSProperties;
};

const StepBar: React.FC<StepBarProps> = ({ step, steps, style }) => {
	const translate = () =>
		step >= steps.length
			? (steps.length - 1) * 100 + '%'
			: (step - 1) * 100 + '%';
	const width = () => `${(1 / steps.length) * 100}%`;
	const left = (i: number) => `${(i / steps.length) * 100}%`;

	const goto = (i: number) => {
		console.log(i);
	};

	const text = (step: string, i: number) =>
		`Step ${i + 1} of ${steps.length}: ${step}`;

	return (
		<div style={style} className={styles.StepBar}>
			{steps.map((s: string, i: number) => (
				<div
					className={`${styles.Placeholder} ${step - 1 > i ? styles.Show : ''}`}
					onClick={() => goto(i)}
					style={{ position: 'absolute', left: left(i), width: width() }}
				>
					{text(s, i)}
				</div>
			))}
			<div
				style={{ width: width(), transform: `translateX(${translate()})` }}
				className={styles.Bar}
			>
				Step {step >= steps.length ? steps.length : step} of {steps.length}:{' '}
				{steps[step - 1]}
			</div>
		</div>
	);
};

export default StepBar;
