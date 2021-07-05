import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FrequencyConTab from '../components/FrequencyConTab';
import { LoadFrequency, LoadFrequencyData } from '../redux/actions/SeperateActions';
import PreLoader from '../components/loaders/PreLoader';

function FrequencyConsole() {
	const dispatchRedux = useDispatch();
	const data = useSelector((state) => state.freq);
	useEffect(() => {
		dispatchRedux(LoadFrequency());
		dispatchRedux(LoadFrequencyData());
	}, []);
	if (data.Loading) {
		return (
			<div className="dashboard">
				<PreLoader />
			</div>
		);
	}
	return (
		<div>
			<div className="heading">Frequency Report</div>
			<FrequencyConTab report={data.data} />
		</div>
	);
}

export default FrequencyConsole;
