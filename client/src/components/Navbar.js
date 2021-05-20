import React from 'react';
// import logout from '../imgs/logout.svg'
// import dashboard from '../imgs/dashboard.svg'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TemporaryDrawer from './Drawer';
import { logoutUser } from '../redux/actions/authAction';

function Navbar() {
	const history = useHistory();
	const auth = useSelector((state) => state.auth);
	const dispatchRedux = useDispatch();
	return (
		<React.Fragment>
			<div className="navbar">
				<div className="navbar__dasboard">
					{auth.user && (
						<div style={{ fontSize: '30px', paddingLeft: '20px', cursor: 'pointer', color: 'white' }}>
							<TemporaryDrawer />
						</div>
					)}
				</div>
				<div className="navbar__logo" onClick={() => history.push('/')}>
					PayTunes Music Ads
				</div>
				<div className="navbar__icons">
					{!auth.isLoading &&
						(auth.user ? (
							<button
								className="btn #ef5350 red lighten-1"
								onClick={() => {
									dispatchRedux(logoutUser());
									history.push('/login');
								}}
								style={{ color: 'black' }}
							>
								<i className="material-icons" style={{ color: 'white' }}>
									exit_to_app
								</i>
							</button>
						) : (
							<button className="btn #ef5350 red lighten-1" onClick={() => history.push('/login')}>
								login
							</button>
						))}
				</div>
			</div>
		</React.Fragment>
	);
}

export default Navbar;
