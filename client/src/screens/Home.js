import React from 'react';
import { useHistory } from 'react-router-dom';

function Home() {
	const history = useHistory();
	const dataT = new URLSearchParams(window.location.search).get('red');
	if (dataT === 'manage') {
		history.push('/manageAds');
	}
	if (dataT === 'client') {
		history.push('/clientSideCamp');
	}
	return <div>home</div>;
}

export default Home;
